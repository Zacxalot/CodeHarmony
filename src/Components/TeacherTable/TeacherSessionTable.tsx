import React from "react";
import "./TeacherTable.scss";
import run from "../../Vectors/run.svg"
import { Link } from "react-router-dom";
import {Session} from "../../Pages/TeacherDashboard/TeacherDashboard";

interface TeacherTableProps {
    sessions:Session[]
}

class TeacherSessionTable extends React.PureComponent<TeacherTableProps,{}> {

    render(){
        const sessionsItems = this.props.sessions.map((session) => 
            <li className="tt-item" key={session.session_name.toString()}>
                <span className="session-name">{session.session_name}</span>
                <span className="lesson-name">{session.plan_name}</span>
                <Link to={"/t/session/" + encodeURIComponent(session.plan_name) + "/" + encodeURIComponent(session.session_name)} className="start-button tt-button button-hover" draggable="false"><img alt="Run symbol" src={run} /></Link>
            </li>
        );
        
        console.log(sessionsItems);

        return (
            <div className="list-border">
                <h2>Sessions</h2>
                <ul className="list-inner">
                    <li className="tt-head"><span className="session-name">Session Name</span><span className="lesson-name">Plan Name</span><span className="head-flex"></span></li>
                    {sessionsItems}
                </ul>
            </div>
            
        );
    };
}

export default TeacherSessionTable;
