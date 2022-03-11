// TODO FIX
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import {
  Button, Container, Stack, Modal, styled, Typography, TextField,
} from '@mui/material';
import { useNavigate } from 'react-router';
import NavBar from '../../Components/NavBar/NavBar';
import TeacherSessionTable from '../../Components/TeacherTable/TeacherSessionTable';
import TeacherPlanTable from '../../Components/TeacherTable/TeacherPlanTable';
import theme from '../../Theme';

interface CreateNewSessionResponse {
  planName: string,
  sessionName: string,
  msg: string
}

interface PlanListResponse {
  plans: Plan[],
  sessions: Session[]
}

export interface Session {
  sessionName: string,
  planName: string
}

export interface Plan {
  planName: string
}

export const ModalBox = styled(Stack)`
  padding: 2rem;
  border-radius:${theme.shape.borderRadius}px;
`;

export const ModalContainer = styled(Modal)`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const [planList, setPlanList] = useState<Plan[]>([]);
  const [sessionList, setSessionList] = useState<Session[]>([]);
  const [newSessionModalOpen, setNewSessionModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionPlanName, setNewSessionPlanName] = useState('');
  const [newSessionError, setNewSessionError] = useState('');

  useEffect(() => {
    axios.get<PlanListResponse>('/plan/list')
      .then(({ data: { plans, sessions } }) => {
        setPlanList(plans);
        setSessionList(sessions);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const requestNewSession = () => {
    const encodedPlanName = encodeURIComponent(newSessionPlanName);
    const encodedNewSessionName = encodeURIComponent(newSessionName);
    axios.post<CreateNewSessionResponse>(`/session/new/${encodedPlanName}/${encodedNewSessionName}`)
      .then(() => {
        navigate(`/t/session/${encodedPlanName}/${encodedNewSessionName}`);
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 400) {
          setNewSessionError('Session name already in use');
        } else {
          setNewSessionError('There was a problem. Please try again later');
        }
      });
  };

  const openCreateSessionModal = (planName: string) => {
    setNewSessionPlanName(planName);
    setNewSessionModalOpen(true);
  };

  return (
    <div>
      <NavBar />

      {/* New session modal */}
      <ModalContainer
        open={newSessionModalOpen}
        onClose={() => { setNewSessionModalOpen(false); }}
      >
        <ModalBox alignItems="center" spacing={1} bgcolor="background.default">
          <Typography variant="h5" color="text.primary">Create New Session</Typography>
          <TextField label="name" onChange={({ target: { value } }) => setNewSessionName(value)} inputProps={{ maxLength: 128 }} error={newSessionError !== ''} helperText={newSessionError} />
          <Button
            variant="contained"
            disabled={newSessionName.length < 4}
            onClick={requestNewSession}
          >
            Create
          </Button>
        </ModalBox>
      </ModalContainer>

      <Container maxWidth="lg">
        <Stack alignItems="center" spacing={2} mt={2}>
          <Stack direction="row" justifyContent="center" spacing={2} />

          <TeacherSessionTable sessions={sessionList} />
          <TeacherPlanTable
            plans={planList}
            newSessionCallback={openCreateSessionModal}
          />
        </Stack>
      </Container>

    </div>
  );
}
