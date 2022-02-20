import React from 'react';
import './TeacherTable.scss';
import { Link } from 'react-router-dom';
import run from '../../Vectors/run.svg';
import { Session } from '../../Pages/TeacherDashboard/TeacherDashboard';

interface TeacherTableProps {
  sessions: Session[]
}

class TeacherSessionTable extends React.PureComponent<TeacherTableProps, {}> {
  render() {
    const { sessions } = this.props;
    const sessionsItems = sessions.map((session) => (
      <li className="tt-item" key={session.sessionName.toString()}>
        <span className="session-name">{session.sessionName}</span>
        <span className="lesson-name">{session.planName}</span>
        <Link to={`/t/session/${encodeURIComponent(session.planName)}/${encodeURIComponent(session.sessionName)}`} className="start-button tt-button button-hover" draggable="false"><img alt="Run symbol" src={run} /></Link>
      </li>
    ));

    console.log(sessionsItems);

    return (
      <div className="list-border">
        <h2>Sessions</h2>
        <ul className="list-inner">
          <li className="tt-head">
            <span className="session-name">Session Name</span>
            <span className="lesson-name">Plan Name</span>
            <span className="head-flex" />
          </li>
          {sessionsItems}
        </ul>
      </div>

    );
  }
}

export default TeacherSessionTable;
