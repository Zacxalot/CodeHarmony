// TODO FIX
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import axios, { AxiosError } from 'axios';
import {
  Button, Container, Stack, Modal, styled, Typography, TextField,
} from '@mui/material';
import { Navigate } from 'react-router';
import NavBar from '../../Components/NavBar/NavBar';
import TeacherSessionTable from '../../Components/TeacherTable/TeacherSessionTable';
import './TeacherDashboard.scss';
import TeacherPlanTable from '../../Components/TeacherTable/TeacherPlanTable';
import theme from '../../Theme';

interface TeacherDashboardState {
  newLessonModalOpen: boolean;
  newSessionModalOpen: boolean;
  newPlanNameValue: string;
  newSessionNameValue: string;
  newSessionPlanName: string;
  newPlanErrorString: string;
  newSessionErrorString: string;
  openNewPlan: string;
  openNewSession: { planName: string, sessionName: string };
  sessions: Session[];
  plans: Plan[];
}

interface CreateNewPlanResponse {
  planName: string,
  msg: string
}

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

const ModalBox = styled(Stack)`
  background-color:${theme.palette.background.default};
  padding: 2rem;
  border-radius:${theme.shape.borderRadius}px;
`;

const ModalContainer = styled(Modal)`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class TeacherDashboard extends React.Component<{}, TeacherDashboardState> {
  constructor(props: any) {
    super(props);
    this.state = {
      newLessonModalOpen: false,
      newSessionModalOpen: false,
      newPlanNameValue: '',
      newPlanErrorString: '',
      newSessionNameValue: '',
      newSessionPlanName: '',
      newSessionErrorString: '',
      openNewPlan: '',
      openNewSession: { planName: '', sessionName: '' },
      sessions: [],
      plans: [],
    };
  }

  componentDidMount() {
    axios.get<PlanListResponse>('/plan/list')
      .then((planlist) => {
        this.setState({ plans: planlist.data.plans, sessions: planlist.data.sessions });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  openCreateLessonModal = () => {
    this.setState({ newPlanNameValue: '', newLessonModalOpen: true, newPlanErrorString: '' });
  }

  closeCreateLessonModal = () => {
    this.setState({ newLessonModalOpen: false });
  }

  openCreateSessionModal = (newSessionPlanName: string) => {
    this.setState({ newPlanNameValue: '', newSessionModalOpen: true, newSessionPlanName });
  }

  closeCreateSessionModal = () => {
    this.setState({ newSessionModalOpen: false });
  }

  lessonNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPlanNameValue: event.target.value, newPlanErrorString: '' });
  }

  sessionNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newSessionNameValue: event.target.value });
  }

  requestNewLessonPlan = () => {
    axios.post<CreateNewPlanResponse>('/plan/new', { planName: this.state.newPlanNameValue })
      .then((response) => {
        this.setState({ openNewPlan: response.data.planName });
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 400) {
          this.setState({ newPlanErrorString: 'Plan name already in use' });
        } else {
          this.setState({ newPlanErrorString: 'There was a problem. Please try again later' });
        }
      });
  }

  requestNewSession = () => {
    axios.post<CreateNewSessionResponse>(`/session/new/${encodeURIComponent(this.state.newSessionPlanName)}/${encodeURIComponent(this.state.newSessionNameValue)}`)
      .then((response) => {
        console.log(response);
        this.setState({
          openNewSession: {
            planName: response.data.planName, sessionName: response.data.sessionName,
          },
        });
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 400) {
          this.setState({ newSessionErrorString: 'Session name already in use' });
        } else {
          this.setState({ newSessionErrorString: 'There was a problem. Please try again later' });
        }
      });
  }

  render() {
    if (this.state.openNewPlan !== '') {
      return (<Navigate to={`/t/plan/${this.state.openNewPlan}`} />);
    }

    // Redirects to the session page when a new session is made
    if (this.state.openNewSession.planName !== '') {
      return (<Navigate to={`/t/session/${encodeURIComponent(this.state.openNewSession.planName)}/${encodeURIComponent(this.state.openNewSession.sessionName)}`} />);
    }

    return (
      <div>
        <NavBar small />

        {/* New lesson plan modal */}
        <ModalContainer
          open={this.state.newLessonModalOpen}
          onClose={this.closeCreateLessonModal}
        >
          <ModalBox alignItems="center" spacing={1}>
            <Typography variant="h5">Create New Lesson Plan</Typography>
            <TextField label="Name" onChange={this.lessonNameChanged} inputProps={{ maxLength: 128 }} error={this.state.newPlanErrorString.length > 0} helperText={this.state.newPlanErrorString} />
            <Button
              variant="contained"
              disabled={this.state.newPlanNameValue.length < 4}
              onClick={this.requestNewLessonPlan}
            >
              Create
            </Button>
          </ModalBox>
        </ModalContainer>

        {/* New session modal */}
        <ModalContainer
          open={this.state.newSessionModalOpen}
          onClose={this.closeCreateSessionModal}
        >
          <ModalBox alignItems="center" spacing={1}>
            <Typography variant="h5">Create New Session</Typography>
            <TextField label="name" onChange={this.sessionNameChanged} inputProps={{ maxLength: 128 }} error={this.state.newSessionErrorString.length > 0} helperText={this.state.newSessionErrorString} />
            <Button
              variant="contained"
              disabled={this.state.newSessionNameValue.length < 4}
              onClick={this.requestNewSession}
            >
              Create
            </Button>
          </ModalBox>
        </ModalContainer>

        <Container maxWidth="lg">
          <Stack alignItems="center" spacing={2} mt={2}>
            <Stack direction="row" justifyContent="center">
              <Button variant="contained" onClick={this.openCreateLessonModal}>New Lesson Plan</Button>
            </Stack>

            <TeacherSessionTable sessions={this.state.sessions} />
            <TeacherPlanTable
              plans={this.state.plans}
              newSessionCallback={this.openCreateSessionModal}
            />
          </Stack>
        </Container>

      </div>
    );
  }
}

export default TeacherDashboard;
