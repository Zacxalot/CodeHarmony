import {
  Button,
  Container, Grid, List, Paper, Stack, TextField, Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CHElementComponent from '../../Components/CHElementComponent/CHElementComponent';
import LessonPlanSectionListItem from '../../Components/LessonPlanSectionListItem/LessonPlanSectionListItem';
import NavBar from '../../Components/NavBar/NavBar';
import TextFieldWithButton from '../../Components/TextFieldWithButton/TextFieldWithButton';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks';
import { ModalBox, ModalContainer } from '../TeacherDashboard/TeacherDashboard';
import { PlanSection } from '../TeacherLessonPlan/TeacherLessonPlan';
import { loadLessonPlan } from '../TeacherLessonPlan/teacherLessonPlanSlice';

interface PublishedPlan {
  // eslint-disable-next-line camelcase
  plan_sections: PlanSection[],
  description: string,
}

export default function TeacherPublishedPlan() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const pathname = useLocation().pathname.split('/');
  const planName = decodeURIComponent(pathname.slice(-2)[0]);
  const username = decodeURIComponent(pathname.slice(-1)[0]);
  const [description, setDescription] = useState('');
  const [selectedSection, setSelectedSection] = useState(0);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveNewName, setSaveNewName] = useState('');
  const planSections: PlanSection[] = useAppSelector((state) => state.planSections);

  const renderSectionsList = () => planSections.map((section, index) => (
    <LessonPlanSectionListItem
      key={section.name}
      sectionName={section.name}
      callback={() => setSelectedSection(index)}
    />
  ));

  // First load
  useEffect(() => {
    setSaveNewName(planName);
    axios.get<PublishedPlan>(`/plan/published/${planName}/${username}`)
      .then(({ data }) => {
        dispatch(loadLessonPlan(data.plan_sections));
        setDescription(data.description);
        if (data.plan_sections.length > 0) {
          setSelectedSection(0);
        }
      })
      .catch(() => console.error('Request failed'));
  }, [planName, dispatch]);

  const renderElements = () => {
    if (planSections[selectedSection]) {
      return planSections[selectedSection].elements.map(
        (element, index) => (<CHElementComponent element={element} key={index.toString()} />),
      );
    }
    return null;
  };

  const saveAsPlan = () => {
    axios.post('/plan/save', { publishedName: planName, publishHost: username, planName: saveNewName })
      .then(() => {
        navigate(`/t/plan/${saveNewName}`);
      })
      .catch(() => { });
  };

  const currentSection: PlanSection = planSections[selectedSection] || { name: 'Section not selected', sectionType: 'Lecture' };

  return (
    <Stack alignItems="center" spacing={2}>
      <ModalContainer
        open={saveModalOpen}
        onClose={() => { setSaveModalOpen(false); }}
      >
        <ModalBox alignItems="center" spacing={1} bgcolor="background.default">
          <TextFieldWithButton
            buttonText="Save"
            onChange={(value) => setSaveNewName(value)}
            label="Plan Name"
            onClick={saveAsPlan}
            value={saveNewName}
            helperText=""
          />
        </ModalBox>
      </ModalContainer>
      <NavBar />
      <Stack maxWidth="lg" width="100%" spacing={2}>
        <Container maxWidth="md" />
        <Typography variant="h2" textAlign="center" sx={{ color: 'text.primary', wordBreak: 'break-all' }}>{decodeURIComponent(planName)}</Typography>
        <Paper sx={{ p: 2 }}>
          <Stack alignItems="center">
            <Typography variant="h5">{description}</Typography>
            <Button variant="contained" onClick={() => { setSaveModalOpen(true); }}>Save Plan</Button>
          </Stack>
        </Paper>
        <Typography variant="h4" sx={{ color: 'text.primary' }}>Sections</Typography>
        <Paper>
          <Stack p={2} spacing={2}>
            <Paper variant="outlined">
              <List sx={{ p: 0 }}>
                {renderSectionsList()}
              </List>
            </Paper>
          </Stack>
        </Paper>
        <Typography variant="h4" sx={{ color: 'text.primary' }}>Details</Typography>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item><TextField value={currentSection.sectionType === 'LECTURE ' ? 'Lecture' : 'Coding'} disabled label="Section Type" /></Grid>
            {currentSection.sectionType === 'CODING  ' ? <Grid item><TextField value={currentSection.codingData.language} disabled label="Language" /></Grid> : null}
          </Grid>
        </Paper>
        <Container>
          <Typography align="center" variant="h3" color="text.primary">{currentSection.name}</Typography>
          <Paper sx={{ p: 2 }}>
            {renderElements()}
          </Paper>
        </Container>
        <div style={{ height: '1rem' }} />
      </Stack>
    </Stack>
  );
}
