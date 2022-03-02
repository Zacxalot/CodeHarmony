import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ArrowDropDown, ArrowDropUp, Remove } from '@mui/icons-material';
import {
  IconButton, MenuItem, Paper, Select, SelectChangeEvent, Stack, TextField,
} from '@mui/material';
import { CHElement } from '../../Pages/TeacherLessonPlan/TeacherLessonPlan';
import { removeElement, updateElement } from '../../Pages/TeacherLessonPlan/teacherLessonPlanSlice';
import CHElementComponent from '../CHElementComponent/CHElementComponent';
import { PaperBox } from '../../Theme';

interface LessonPlanEditorElementProps {
  element: CHElement,
  sectionId: number,
  id: number
}

function LessonPlanEditorElement({ element, sectionId, id }: LessonPlanEditorElementProps) {
  const [textValue, setTextValue] = useState(element.children.String);
  const dispatch = useDispatch();

  useEffect(() => {
    setTextValue(element.children.String);
  }, [element.children.String]);

  const handleTypeChange = (e: SelectChangeEvent) => {
    // Clear the text value if the element is set to image
    if (e.target.value === 'img') {
      setTextValue('');
      dispatch(updateElement({
        type: 'child', newValue: '', id, sectionId,
      }));
    }

    dispatch(updateElement({
      type: 'eltype', newValue: e.target.value, id, sectionId,
    }));
  };

  const handlePositionUp = () => {
    dispatch(updateElement({
      type: 'move', newValue: 'up', id, sectionId,
    }));
    console.log('Up');
  };

  const handlePositionDown = () => {
    dispatch(updateElement({
      type: 'move', newValue: 'down', id, sectionId,
    }));
    console.log('Down');
  };

  const handleTextboxChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    dispatch(updateElement({
      type: 'child', newValue: e.target.value, id, sectionId,
    }));
    setTextValue(e.target.value);
  };

  const handleRemoveElement = () => {
    dispatch(removeElement({ index: id, sectionId }));
  };

  const renderInput = () => {
    if (element.elType === 'img') {
      return <TextField onChange={handleTextboxChange} value={textValue} />;
    }

    return <TextField onChange={handleTextboxChange} value={textValue} />;
  };

  return (
    <PaperBox elevation={2}>
      <Paper elevation={1}>
        <CHElementComponent element={element} />
      </Paper>
      <Stack direction="row" p={0.5} spacing={0.5}>
        <Stack flex={1} spacing={0.5}>
          <Select value={element.elType} onChange={handleTypeChange}>
            <MenuItem value="h1">Heading</MenuItem>
            <MenuItem value="p">Paragraph</MenuItem>
            <MenuItem value="img">Image</MenuItem>
          </Select>
          {renderInput()}
        </Stack>

        <Stack flex={0} justifyContent="center">
          <IconButton onClick={handlePositionUp}>
            <ArrowDropUp color="primary" fontSize="large" />
          </IconButton>
          <IconButton onClick={handleRemoveElement}>
            <Remove color="primary" fontSize="large" />
          </IconButton>
          <IconButton onClick={handlePositionDown}>
            <ArrowDropDown color="primary" fontSize="large" />
          </IconButton>
        </Stack>
      </Stack>

    </PaperBox>
  );
}

export default LessonPlanEditorElement;
