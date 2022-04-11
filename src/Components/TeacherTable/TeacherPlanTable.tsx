import React, { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, IconButton, Typography, Paper, Box, TextField, Button, Stack,
} from '@mui/material';
import axios, { AxiosError } from 'axios';
import {
  Add, PlayArrow, Settings, Upload,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { debounce } from 'lodash';
import { ModalBox, ModalContainer, Plan } from '../../Pages/TeacherDashboard/TeacherDashboard';

interface TeacherTableProps {
  // eslint-disable-next-line no-unused-vars
  newSessionCallback: (planName: string) => void,
  plans: Plan[]
}

interface CreateNewPlanResponse {
  planName: string,
  msg: string
}

const columns: GridColDef[] = [
  { field: 'planName', headerName: 'Plan Name', flex: 1 },
  {
    field: 'start',
    headerName: 'Start',
    sortable: false,
    renderCell: ({ row }) => (
      <IconButton onClick={() => { row.callback(row.planName); }}>
        <PlayArrow />
      </IconButton>
    ),
  },
  {
    field: 'configure',
    headerName: 'Configure',
    sortable: false,
    renderCell: ({ row }) => <IconButton component={Link} to={`/t/plan/${row.planName}`}><Settings /></IconButton>,
  },
  {
    field: 'publish',
    headerName: 'Publish',
    sortable: false,
    renderCell: ({ row }) => (
      <IconButton onClick={() => { row.publishCallback(row.planName); }}><Upload /></IconButton>
    ),
  },
];

function TeacherPlanTable({ plans, newSessionCallback }: TeacherTableProps) {
  const navigate = useNavigate();

  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [errorString, setErrorString] = useState('');
  const [planToPublish, setPlanToPublish] = useState('');
  const [description, setDescription] = useState('');

  const openPublishModal = (planName: string) => {
    console.log(planName);
    setPublishModalOpen(true);
    setNewPlanName(planName);
    setPlanToPublish(planName);
  };

  const plansWithCallback = useMemo(
    () => (
      plans.map(
        (plan) => ({
          planName: plan.planName,
          callback: newSessionCallback,
          publishCallback: openPublishModal,
        }),
      )
    ),
    [plans],
  );

  const requestNewLessonPlan = () => {
    axios.post<CreateNewPlanResponse>('/plan/new', { planName: newPlanName })
      .then(({ data: { planName } }) => {
        navigate(`/t/plan/${planName}`);
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 400) {
          setErrorString('Plan name already in use');
        } else {
          setErrorString('There was a problem. Please try again later');
        }
      });
  };

  const publishLesson = () => {
    axios.post('/plan/publish', { planName: planToPublish, publishName: newPlanName, description }).catch((e) => { console.log(e); });
  };

  const publishButtonHandler = useCallback(
    debounce(publishLesson, 2000, { leading: true }),
    [planToPublish, newPlanName, description],
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* New lesson plan modal */}
      <ModalContainer
        open={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
      >
        <ModalBox alignItems="center" spacing={1} bgcolor="background.default">
          <Typography variant="h5" color="text.primary">Create New Lesson Plan</Typography>
          <TextField label="Name" onChange={({ target: { value } }) => setNewPlanName(value)} inputProps={{ maxLength: 128 }} error={errorString !== ''} helperText={errorString} />
          <Button
            variant="contained"
            disabled={newPlanName.length < 4}
            onClick={requestNewLessonPlan}
          >
            Create
          </Button>
        </ModalBox>
      </ModalContainer>
      {/* Publish lesson plan modal */}
      <ModalContainer open={publishModalOpen} onClose={() => { setPublishModalOpen(false); }}>
        <ModalBox alignItems="center" spacing={1} bgcolor="background.default">
          <Typography variant="h5" color="text.primary">Publish Lesson Plan</Typography>
          <TextField label="Name" onChange={({ target: { value } }) => setNewPlanName(value)} inputProps={{ maxLength: 128 }} value={newPlanName} />
          <TextField label="Description" onChange={({ target: { value } }) => setDescription(value)} inputProps={{ maxLength: 300 }} value={description} multiline sx={{ width: '32rem' }} rows={4} />
          <Button variant="contained" disabled={newPlanName.length < 4} onClick={publishButtonHandler}>Publish/Update</Button>
        </ModalBox>
      </ModalContainer>
      <Container>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4" color="text.primary">Plans</Typography>
            <Button variant="contained" onClick={() => { setSessionModalOpen(true); }} endIcon={<Add />}>New Plan</Button>
          </Stack>
          <Paper>
            <DataGrid
              rows={plansWithCallback}
              columns={columns}
              getRowId={(row) => row.planName}
              autoHeight
              rowCount={20}
              rowsPerPageOptions={[]}
              disableSelectionOnClick
            />
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}

export default TeacherPlanTable;
