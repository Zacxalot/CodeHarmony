// TODO FIX
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Modal from 'react-modal';
import axios, { AxiosError } from 'axios';
import { Navigate } from 'react-router';
import NavBar from '../../Components/NavBar/NavBar';
import TeacherSessionTable from '../../Components/TeacherTable/TeacherSessionTable';
import LargeLinkButton from '../../Components/LargeLinkButton/LargeLinkButton';
import LargeCallbackButton from '../../Components/LargeCallbackButton/LargeCallbackButton';
import './TeacherDashboard.scss';
import CHButton from '../../Components/Basic UI/CHButton/CHButton';
import TeacherPlanTable from '../../Components/TeacherTable/TeacherPlanTable';

interface TeacherDashboardState {
  newLessonModalOpen: boolean;
  newSessionModalOpen: boolean;
  newPlanNameValue: string;
  newSessionNameValue: string;
  newSessionPlanName: string;
  newPlanErrorString: string;
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

class TeacherDashboard extends React.Component<{}, TeacherDashboardState> {
  constructor(props: any) {
    super(props);
    this.state = {
      newLessonModalOpen: false,
      newSessionModalOpen: false,
      newPlanNameValue: '',
      newSessionNameValue: '',
      newSessionPlanName: '',
      newPlanErrorString: '',
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
    this.setState({ newPlanNameValue: event.target.value });
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
          // TODO
        } else {
          // TODO
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
      <div className="full-page">
        <NavBar small />

        {/* New lesson plan modal */}
        <Modal ariaHideApp={false} className="new-lesson-modal-style" isOpen={this.state.newLessonModalOpen} onRequestClose={this.closeCreateLessonModal}>
          <h4>Create New Lesson Plan</h4>
          <span>
            <label>Name:</label>
            <input onChange={this.lessonNameChanged} type="text" maxLength={128} />
          </span>
          <span className="error">
            {this.state.newPlanErrorString}
          </span>

          <CHButton text="Create" disabled={this.state.newPlanNameValue.length < 4} fontBlack colour="#72e217" callback={this.requestNewLessonPlan} />
        </Modal>

        <Modal ariaHideApp={false} className="new-lesson-modal-style" isOpen={this.state.newSessionModalOpen} onRequestClose={this.closeCreateSessionModal}>
          <h4>Create New Session</h4>
          <span>
            <span>
              Plan Name:
              {' '}
              {this.state.newSessionPlanName}
            </span>
            <label>Session Name:</label>
            <input onChange={this.sessionNameChanged} type="text" maxLength={128} />
          </span>
          <CHButton text="Create" disabled={this.state.newSessionNameValue.length < 4} fontBlack colour="#72e217" callback={this.requestNewSession} />
        </Modal>
        <div className="page-container">
          <div>
            <LargeLinkButton to="session/new/" emoji="👨‍🏫️">New Session</LargeLinkButton>
            <LargeCallbackButton callback={this.openCreateLessonModal} emoji="✍️">New Lesson Plan</LargeCallbackButton>
          </div>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
            <TeacherSessionTable sessions={this.state.sessions} />
            <TeacherPlanTable
              plans={this.state.plans}
              newSessionCallback={this.openCreateSessionModal}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TeacherDashboard;
