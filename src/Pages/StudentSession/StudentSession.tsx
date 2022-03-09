import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Stack, CircularProgress,
} from '@mui/material';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import { PlanSection } from '../TeacherLessonPlan/TeacherLessonPlan';
import { renderSection } from '../TeacherSession/TeacherSession';

console.log('Starting WS');

export default function StudentSession() {
  const location = useLocation();
  const [planSections, setPlanSections] = useState<PlanSection[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);

  useEffect(() => {
    console.log('running');
    const [planName] = location.pathname.split('/').splice(-2);
    setSocket(new WebSocket('ws://localhost:8080/ws'));
    axios.get<PlanSection[]>(`/plan/info/${planName}`)
      .then(({ data }) => {
        setPlanSections(data);
      })
      .catch(() => { });
  }, []);

  // When socket connects
  useEffect(() => {
    const [planName, sessionName] = location.pathname.split('/').splice(-2);
    if (socket) {
      socket.onopen = () => {
        socket.send(`sJoin ${planName}:${sessionName}:user1`);
        console.log('opened');
      };

      socket.onmessage = (message) => {
        const text: String = message.data;
        const split = text.split(' ');

        if (split[0] === 'sec') {
          setCurrentSection(parseInt(split[1], 10));
        }
      };
    }
  }, [socket]);

  const renderLoading = () => {
    if (planSections.length === 0) {
      return (<CircularProgress />);
    }
    return null;
  };

  const renderElements = useMemo(() => {
    if (planSections.length !== 0 && currentSection < planSections.length && currentSection >= 0) {
      return (renderSection(planSections[currentSection]));
    }
    return (null);
  }, [planSections, currentSection]);

  return (
    <div>
      <NavBar />
      <Stack alignItems="center">
        {renderElements}
        {renderLoading()}
      </Stack>
    </div>
  );
}
