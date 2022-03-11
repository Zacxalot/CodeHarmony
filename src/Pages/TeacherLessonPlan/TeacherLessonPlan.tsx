import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {
  Button,
  Container, Paper, Stack, TextField, Typography,
} from '@mui/material';
import NavBar from '../../Components/NavBar/NavBar';
import LessonPlanSectionListItem from '../../Components/LessonPlanSectionListItem/LessonPlanSectionListItem';
import LessonPlanEditor from '../../Components/LessonPlanEditor/LessonPlanEditor';
import {
  clearChangedFlag, createNewSection, loadLessonPlan, setSectionOrders,
} from './teacherLessonPlanSlice';
import { useAppSelector } from '../../Redux/hooks';
import './TeacherLessonPlan.scss';

export interface CodingData {
  language: string,
  startingCode: string,
  expectedOutput: string,
}

export interface PlanSection {
  name: string,
  sectionType: string,
  elements: CHElement[],
  orderPos: number,
  changed: boolean,
  codingData: CodingData,
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
  index: number,
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
  // eslint-disable-next-line no-undef
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
            .then(() => {
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

  const isNameTaken = (sectionName: string): boolean => {
    if (planSections.find((section) => section.name === sectionName)) {
      return true;
    }
    return false;
  };

  const renderLessonPlanEditor = () => {
    if (selectedSection !== -1) {
      return (
        <Container>
          <Typography align="center" variant="h4">{planSections[selectedSection].name}</Typography>
          <LessonPlanEditor
            planSection={planSections[selectedSection]}
            sectionId={selectedSection}
            sectionNameChecker={isNameTaken}
            planName={planName}
          />
        </Container>
      );
    }

    return <div>Add a section to get started</div>;
  };

  // Request to add a new section to the plan
  const addNewSection = () => {
    const newName = newSectionName;

    axios.post(`/plan/info/${planName}`, { request: 'new-section', data: { sectionName: newSectionName, orderPos: planSections.length } })
      .then(() => {
        dispatch(createNewSection({
          name: newName, sectionType: 'LECTURE ', elements: [], orderPos: planSections.length, changed: false, codingData: { language: 'python', startingCode: '', expectedOutput: '' },
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
    <Stack alignItems="center" spacing={2}>
      <NavBar />
      <Stack maxWidth="lg" width="100%" spacing={2}>
        <Container maxWidth="md">
          <Paper>
            <Stack py={2} spacing={2}>
              <Typography variant="h4" align="center">Sections</Typography>
              <ul>
                {renderSectionsList()}
              </ul>
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                <TextField onChange={(e) => { setNewSectionName(e.target.value); }} />
                <Button size="large" onClick={() => { addNewSection(); }} variant="contained">Add</Button>
              </Stack>
            </Stack>
          </Paper>
        </Container>
        {renderLessonPlanEditor()}
      </Stack>
    </Stack>
  );
}

export default TeacherLessonPlan;
