// TODO FIX
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import {
  Button, Container, Stack, Modal, styled, Typography, TextField, Paper,
} from '@mui/material';
import { useNavigate } from 'react-router';
import NavBar from '../../Components/NavBar/NavBar';
import TeacherSessionTable from '../../Components/TeacherTable/TeacherSessionTable';
import TeacherPlanTable from '../../Components/TeacherTable/TeacherPlanTable';
import { lightTheme } from '../../Theme';
import TeacherPublishedTable from '../../Components/TeacherTable/TeacherPublishedTable';
import { PlanSearchInfo } from '../PlanShare/PlanShare';

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
  border-radius:${lightTheme.shape.borderRadius}px;
  ailign-items:center;
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
  const [publishedList, setPublishedList] = useState<PlanSearchInfo[]>([]);
  const [newSessionModalOpen, setNewSessionModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionPlanName, setNewSessionPlanName] = useState('');
  const [newSessionError, setNewSessionError] = useState('');

  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [teacherCode, setTeacherCode] = useState('');

  const getPublishedPlans = () => {
    axios.get<PlanSearchInfo[]>('/plan/published')
      .then(({ data }) => {
        setPublishedList(data);
      }).catch(() => { });
  };

  useEffect(() => {
    axios.get<PlanListResponse>('/plan/list')
      .then(({ data: { plans, sessions } }) => {
        setPlanList(plans);
        setSessionList(sessions);
      })
      .catch((err) => {
        console.log(err);
      });

    getPublishedPlans();
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

  const openCodeModal = () => {
    axios.get<{ code: string }>('/account/my-code')
      .then(({ data: { code } }) => {
        setCodeModalOpen(true);
        setTeacherCode(code);
      }).catch(() => { });
  };

  return (
    <div>
      <NavBar />

      {/* New session modal */}
      <ModalContainer
        open={newSessionModalOpen}
        onClose={() => { setNewSessionModalOpen(false); }}
      >
        <ModalBox spacing={1} bgcolor="background.default">
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

      <ModalContainer
        open={codeModalOpen}
        onClose={() => { setCodeModalOpen(false); }}
      >
        <ModalBox spacing={1} bgcolor="background.default" alignItems="center">
          <Typography variant="h5" color="text.primary" style={{ userSelect: 'none' }}>Teacher Code</Typography>
          <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h1" minHeight="2rem" textAlign="center" fontWeight={700}>{teacherCode}</Typography>
          </Paper>
        </ModalBox>
      </ModalContainer>

      <Container maxWidth="lg">
        <Stack alignItems="center" spacing={2} mt={2}>
          <Container>
            <Paper>
              <Stack direction="row" p={1} justifyContent="center">
                <Button variant="contained" onClick={openCodeModal}>Show Code</Button>
              </Stack>
            </Paper>
          </Container>
          <TeacherSessionTable sessions={sessionList} />
          <TeacherPlanTable
            plans={planList}
            refreshPublishedPlans={getPublishedPlans}
            newSessionCallback={openCreateSessionModal}

          />
          <TeacherPublishedTable plans={publishedList} refreshPublishedPlans={getPublishedPlans} />
        </Stack>
      </Container>

    </div>
  );
}
