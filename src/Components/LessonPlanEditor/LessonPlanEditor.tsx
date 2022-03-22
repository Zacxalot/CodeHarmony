import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button, FormControl, FormHelperText, MenuItem, Paper, Select, SelectChangeEvent, Stack,
} from '@mui/material';
import axios from 'axios';
import { Add } from '@mui/icons-material';
import { PlanSection } from '../../Pages/TeacherLessonPlan/TeacherLessonPlan';
import LessonPlanEditorElement from '../LessonPlanEditorElement/LessonPlanEditorElement';
import {
  addNewElement, setSectionLanguage, setSectionName, setSectionType,
} from '../../Pages/TeacherLessonPlan/teacherLessonPlanSlice';
import TextFieldWithButton from '../TextFieldWithButton/TextFieldWithButton';

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
        <FormControl>
          <Select value={sectionLanguageSelect} onChange={changeSectionLanguage}>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="javascript">Javascript</MenuItem>
          </Select>
          <FormHelperText>Section Type</FormHelperText>
        </FormControl>
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

  if (planSection.sectionType === 'undefined') {
    return (<div>To get started, add a new section!</div>);
  }

  return (
    // eslint-disable-next-line react/no-unstable-nested-components
    <Stack spacing={1}>
      <Paper>
        <Stack p={2} spacing={2}>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
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
          <FormControl>
            <Select value={sectionTypeSelect} onChange={changeSectionType}>
              <MenuItem value="LECTURE ">Lecture</MenuItem>
              <MenuItem value="CODING  ">Coding</MenuItem>
            </Select>
            <FormHelperText>Section Type</FormHelperText>
          </FormControl>
          {renderCodingOptions()}
        </Stack>
      </Paper>
      {addElementSlimButton(0)}
      {renderSectionElements()}

    </Stack>
  );
}

export default LessonPlanEditor;
