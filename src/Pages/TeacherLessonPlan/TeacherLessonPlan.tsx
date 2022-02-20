// TODO Fix
/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import NavBar from '../../Components/NavBar/NavBar';
import LessonPlanSectionListItem from '../../Components/LessonPlanSectionListItem/LessonPlanSectionListItem';
import LessonPlanEditor from '../../Components/LessonPlanEditor/LessonPlanEditor';
import {
  clearChangedFlag, createNewSection, loadLessonPlan, setSectionOrders,
} from './teacherLessonPlanSlice';
import { useAppSelector } from '../../Redux/hooks';
import './TeacherLessonPlan.scss';

export interface PlanSection {
  name: string,
  sectionType: string,
  elements: CHElement[],
  orderPos: number,
  changed: boolean
}

export interface CHElement {
  elType: string,
  props: {},
  children: CHElementChild
}

interface CHElementChild {
  JSX?: CHElement[]
  String?: string
}

export interface EditorElementChange {
  type: string,
  newValue?: string,
  id: number,
  sectionId: number
}

export interface EditorElementNew {
  sectionId: number
}

function TeacherLessonPlan() {
  const location = useLocation();
  const dispatch = useDispatch();
  const planSections: PlanSection[] = useAppSelector((state) => state.planSections);
  const [selectedSection, setSelectedSection] = useState<number>(-1);
  const [newSectionName, setNewSectionName] = useState<string>('');
  const planName = location.pathname.split('/').slice(-1)[0];

  // Timer that waits before changes stop before sending update request
  const updateTimer = useRef<NodeJS.Timeout>();

  // First load
  useEffect(() => {
    axios.get<PlanSection[]>(`/plan/info/${planName}`)
      .then((sections) => {
        dispatch(loadLessonPlan(sections.data));
        if (sections.data.length > 0) {
          setSelectedSection(0);
        }
      })
      .catch(() => console.error('Request failed'));
  }, [planName, dispatch]);

  // On plan section change
  useEffect(() => {
    // Uploads changes of sections to API
    // Called by the update timer below
    const uploadPlan = () => {
      for (let i = 0; i < planSections.length; i += 1) {
        dispatch(setSectionOrders());

        if (planSections[i].changed) {
          axios.put(`/plan/info/${planName}`, planSections[i])
            .then((response) => {
            })
            .catch(() => console.error('Upload failed'));
        }
      }

      // Clear out all of the "changed" flags
      dispatch(clearChangedFlag());

      // Disable the reload blocker
      window.onbeforeunload = null;
    };

    if (planSections.length >= 1) {
      // Reset the timer
      if (updateTimer.current !== undefined) {
        clearTimeout(updateTimer.current);
      }
      updateTimer.current = setTimeout(uploadPlan, 3000);

      // Prevent the reload while updating database
      window.onbeforeunload = () => true;
    } else {
      setSelectedSection(-1);
    }
  }, [dispatch, planSections, planName]);

  const renderLessonPlanEditor = () => {
    if (selectedSection !== -1) {
      return (
        <div>
          <h1>{planSections[selectedSection].name}</h1>
          <LessonPlanEditor
            planSection={planSections[selectedSection]}
            sectionId={selectedSection}
          />
        </div>
      );
    }

    return <div>Add a section to get started</div>;
  };

  // Request to add a new section to the plan
  const addNewSection = () => {
    const newName = newSectionName;

    axios.post(`/plan/info/${planName}`, { request: 'new-section', data: { section_name: newSectionName, orderPos: planSections.length } })
      .then(() => {
        dispatch(createNewSection({
          name: newName, sectionType: 'LECTURE', elements: [], orderPos: planSections.length, changed: false,
        }));
      })
      .catch(() => console.error('Request failed'));
  };

  // Passed to the section list items as a callback
  const changeSection = (index: number) => {
    setSelectedSection(index);
  };

  const renderSectionsList = () => planSections.map((section, index) => (
    <LessonPlanSectionListItem
      key={section.name}
      sectionName={section.name}
      position={index}
      callback={changeSection}
    />
  ));

  return (
    <div className="full-page">
      <NavBar small />
      <div className="page-container">
        <div className="section-options-container">
          <h1>Sections</h1>
          <ul>
            {renderSectionsList()}
          </ul>
          <form action="" onSubmit={(e) => { e.preventDefault(); addNewSection(); }} className="new-section-container">
            <input onChange={(e) => { setNewSectionName(e.target.value); }} className="new-section-name-box" type="text" />
            <input type="submit" value="Add" className="new-section-button button-hover" />
          </form>

        </div>
        {renderLessonPlanEditor()}
      </div>
    </div>
  );
}

export default TeacherLessonPlan;
