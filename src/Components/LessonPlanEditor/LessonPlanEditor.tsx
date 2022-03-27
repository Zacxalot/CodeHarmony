import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button, FormControl, InputLabel,
  MenuItem, Paper, Select, SelectChangeEvent, Stack, Typography,
} from '@mui/material';
import axios from 'axios';
import {
  Add, Build, Cancel, Save,
} from '@mui/icons-material';
import { PlanSection } from '../../Pages/TeacherLessonPlan/TeacherLessonPlan';
import LessonPlanEditorElement from '../LessonPlanEditorElement/LessonPlanEditorElement';
import {
  addNewElement, setSectionLanguage, setSectionName, setSectionType, setStarterAndExpectedCode,
} from '../../Pages/TeacherLessonPlan/teacherLessonPlanSlice';
import TextFieldWithButton from '../TextFieldWithButton/TextFieldWithButton';
import { ModalBox, ModalContainer } from '../../Pages/TeacherDashboard/TeacherDashboard';
import Codemirror from '../Codemirror/Codemirror';

interface LessonPlanEditorProps {
  planSection: PlanSection,
  sectionId: number,
  // eslint-disable-next-line no-unused-vars
  sectionNameChecker: (arg0: string) => boolean,
  planName: string
}

function LessonPlanEditor(
  {
    planSection,
    sectionId,
    sectionNameChecker,
    planName,
  }: LessonPlanEditorProps,
) {
  const [updateSectionNameText, setUpdateSectionNameText] = useState(planSection.name);
  const [updateSectionNameError, setUpdateSectionNameError] = useState('');
  const [sectionTypeSelect, setSectionTypeSelect] = useState(planSection.sectionType);
  // eslint-disable-next-line max-len
  const [sectionLanguageSelect, setSectionLanguageSelect] = useState(planSection.codingData.language);
  const [editingCode, setEditingCode] = useState('');

  const codemirrorRef = useRef<Codemirror>(null);

  const dispatch = useDispatch();

  const handleAddNewElement = (index: number) => {
    dispatch(addNewElement({ index, sectionId }));
  };

  const addElementSlimButton = (index: number) => <Button variant="outlined" onClick={() => handleAddNewElement(index)} endIcon={<Add />} fullWidth />;

  useEffect(() => {
    setUpdateSectionNameText(planSection.name);
    setUpdateSectionNameError('');
  }, [planSection]);

  const renderSectionElements = () => (
    planSection.elements.map((element, index) => (
      <Stack spacing={1} key={index.toString()}>
        <LessonPlanEditorElement
          element={element}
          sectionId={sectionId}
          id={index}
        />
        {addElementSlimButton(index + 1)}
      </Stack>
    ))
  );

  const changeSectionLanguage = (({ target: { value } }: SelectChangeEvent) => {
    dispatch(setSectionLanguage({ sectionId, newLanguage: value }));
    setSectionLanguageSelect(value);
  });

  const renderCodingOptions = () => {
    if (planSection.sectionType === 'CODING  ') {
      return (
        <Stack justifyContent="center" direction="row" spacing={1}>
          <FormControl>
            <InputLabel>Language</InputLabel>
            <Select value={sectionLanguageSelect} onChange={changeSectionLanguage} label="Language">
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="javascript">Javascript</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            endIcon={<Build />}
            onClick={() => { setEditingCode('Starter Code'); }}
          >
            Starter Code
          </Button>
          <Button
            variant="contained"
            endIcon={<Build />}
            onClick={() => { setEditingCode('Expected Console Output'); }}
          >
            Answers
          </Button>
        </Stack>
      );
    }

    return null;
  };

  const changeSectionType = ({ target: { value } }: SelectChangeEvent) => {
    console.log(value);
    // If it hasn't changed, don't update it
    if (value !== planSection.sectionType) {
      axios.put(`/plan/info/${planName}/update-type`, { section_name: planSection.name, new_type: value })
        .then(() => {
          dispatch(setSectionType({ sectionId, newType: value }));
          setSectionTypeSelect(value);
        })
        .catch();
    }
  };

  const saveCodingOption = () => {
    if (codemirrorRef.current) {
      const toSet = editingCode.startsWith('S') ? 'starter' : 'result';
      dispatch(
        setStarterAndExpectedCode(
          { sectionId, newCode: codemirrorRef.current.getEditorState().join('\n'), toSet },
        ),
      );

      setEditingCode('');
    }
  };

  if (planSection.sectionType === 'undefined') {
    return (<div>To get started, add a new section!</div>);
  }

  return (
    // eslint-disable-next-line react/no-unstable-nested-components
    <Stack spacing={1}>
      <ModalContainer open={editingCode !== ''}>
        <ModalBox
          sx={{
            maxWidth: '90vw', width: '90vw', maxHeight: '90vh', p: 1,
          }}
          bgcolor="background.default"
          spacing={1}
        >
          <Typography variant="h6" color="text.primary" textAlign="center">{editingCode}</Typography>
          <Box sx={{
            flex: 1,
            minHeight: '80vh',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
          >
            <Codemirror ref={codemirrorRef} />
          </Box>
          <Stack direction="row" justifyContent="center" spacing={1}>
            <Button variant="contained" endIcon={<Save />} onClick={() => { saveCodingOption(); }}>Save</Button>
            <Button variant="contained" endIcon={<Cancel />} onClick={() => { setEditingCode(''); }}>Cancel</Button>
          </Stack>
        </ModalBox>
      </ModalContainer>
      <Paper>
        <Stack p={2} spacing={2}>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
            <FormControl sx={{ width: 'fit-content' }}>
              <InputLabel>Section Type</InputLabel>
              <Select value={sectionTypeSelect} onChange={changeSectionType} label="Section Type">
                <MenuItem value="LECTURE ">Lecture</MenuItem>
                <MenuItem value="CODING  ">Coding</MenuItem>
              </Select>
            </FormControl>
            <TextFieldWithButton
              onChange={(value) => {
                setUpdateSectionNameText(value);
                if (sectionNameChecker(value) === true) {
                  setUpdateSectionNameError('Section name in use');
                } else {
                  setUpdateSectionNameError('');
                }
              }}
              helperText={updateSectionNameError}
              label="Section Name"
              onClick={() => {
                axios.put(`/plan/info/${planName}/rename`, { old_section_name: planSection.name, new_section_name: updateSectionNameText })
                  .then(() => {
                    dispatch(setSectionName({ sectionId, newName: updateSectionNameText }));
                  })
                  .catch();
              }}
              buttonDisabled={updateSectionNameText.trim().length === 0 || updateSectionNameError !== ''}
              buttonText="Update"
              value={updateSectionNameText}
            />
          </Stack>

          {renderCodingOptions()}
        </Stack>
      </Paper>
      {addElementSlimButton(0)}
      {renderSectionElements()}

    </Stack>
  );
}

export default LessonPlanEditor;
