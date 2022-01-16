import React from "react";
import "./TeacherTable.scss";
import gear from "../../Vectors/gear.svg";
import run from "../../Vectors/run.svg"
import { Link } from "react-router-dom";
import {Plan} from "../../Pages/TeacherDashboard/TeacherDashboard";

interface TeacherTableProps {
    plans:Plan[],
    newSessionCallback:(planName:string)=>void
}



class TeacherPlanTable extends React.PureComponent<TeacherTableProps,{}> {
    render(){
        const planItems = this.props.plans.map((plan) => 
            <li className="tt-item" key={plan.plan_name.toString()}>
                <span className="session-name">{plan.plan_name}</span>
                <span className="start-button tt-button button-hover" onClick={() => this.props.newSessionCallback(plan.plan_name)}><img alt="Run symbol" src={run} /></span>
                <Link to={"/t/plan/" + plan.plan_name} className="manage-button tt-button button-hover" draggable="false"><img alt="Gear symbol" src={gear} /></Link>
            </li>
        );
        

        return (
            <div className="list-border">
                <h2>Plans</h2>
                <ul className="list-inner">
                    <li className="tt-head"><span className="session-name">Plan Name</span><span className="manage-head">Manage</span></li>
                    {planItems}
                </ul>
            </div>
        );
    };
}

export default TeacherPlanTable;
