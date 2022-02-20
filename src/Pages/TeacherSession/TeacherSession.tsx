// TODO FIX THESE
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';
import { PlanSection } from '../TeacherLessonPlan/TeacherLessonPlan';
import leftArrow from '../../Vectors/left black.svg';
import rightArrow from '../../Vectors/right black.svg';
import './TeacherSession.scss';
import CHElementComponent from '../../Components/CHElementComponent/CHElementComponent';

interface LessonSession {
  plan: PlanSection[],
  session: SessionInfo
}

interface SessionInfo {
  date: number
}

function TeacherSession() {
  const location = useLocation();
  const planName = location.pathname.split('/').slice(-2)[0];
  const sessionName = location.pathname.split('/').slice(-1)[0];

  const [planSections, setPlanSections] = useState<PlanSection[]>();
  const [currentSection, setCurrentSection] = useState<number>(0);

  // First load
  useEffect(() => {
    console.log(planName);
    axios.get<LessonSession>(`/session/info/${planName}/${sessionName}`)
      .then((lessonSession) => {
        setPlanSections(lessonSession.data.plan);
      })
      .catch(() => console.error('Request failed'));
  }, [planName, sessionName]);

  const renderElements = () => {
    if (planSections !== undefined && currentSection < planSections.length && currentSection >= 0) {
      // TODO fix key
      return planSections[currentSection].elements.map(
        // eslint-disable-next-line react/no-array-index-key
        (element, index) => <CHElementComponent element={element} key={index} />,
      );
    }

    return <span>Could not display section!</span>;
  };

  const renderSectionsTitle = () => {
    if (planSections !== undefined && currentSection < planSections.length && currentSection >= 0) {
      return <span className="title-flex">{planSections[currentSection].name}</span>;
    }

    return <span>No Section Selected</span>;
  };

  const regressSection = () => {
    if (planSections !== undefined && currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const advanceSection = () => {
    if (planSections !== undefined && currentSection < planSections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  return (
    <div className="full-page">
      <NavBar small />
      <div className="page-container">
        <div className="sections-picker">
          <span className="arrow-flex button-hover arrow-left" onClick={() => regressSection()}><img className="arrow-image" alt="Left arrow" src={leftArrow} draggable="false" /></span>
          {renderSectionsTitle()}
          <span className="arrow-flex button-hover arrow-right" onClick={() => advanceSection()}><img className="arrow-image" alt="Right arrow" src={rightArrow} draggable="false" /></span>
        </div>
        {renderElements()}
      </div>
    </div>
  );
}

export default TeacherSession;
