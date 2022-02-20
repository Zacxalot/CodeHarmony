// TODO FIX THESE
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import './TeacherTable.scss';
import { Link } from 'react-router-dom';
import gear from '../../Vectors/gear.svg';
import run from '../../Vectors/run.svg';
import { Plan } from '../../Pages/TeacherDashboard/TeacherDashboard';

interface TeacherTableProps {
  plans: Plan[],
  newSessionCallback: (planName: string) => void
}

class TeacherPlanTable extends React.PureComponent<TeacherTableProps, {}> {
  render() {
    const { plans, newSessionCallback } = this.props;
    const planItems = plans.map((plan) => (
      <li className="tt-item" key={plan.planName.toString()}>
        <span className="session-name">{plan.planName}</span>
        <span className="start-button tt-button button-hover" onClick={() => newSessionCallback(plan.planName)}><img alt="Run symbol" src={run} /></span>
        <Link to={`/t/plan/${plan.planName}`} className="manage-button tt-button button-hover" draggable="false"><img alt="Gear symbol" src={gear} /></Link>
      </li>
    ));

    return (
      <div className="list-border">
        <h2>Plans</h2>
        <ul className="list-inner">
          {planItems}
        </ul>
      </div>
    );
  }
}

export default TeacherPlanTable;
