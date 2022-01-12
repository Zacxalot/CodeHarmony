import React from "react";
import "./TeacherTable.scss";
import gear from "../../Vectors/gear.svg";
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
                <span className="lesson-name">{session.lesson_name}</span>
                <span className="participant-count">{session.participant_count}</span>
                <Link to="manage/" className="manage-button" draggable="false"><img alt="Gear symbol" src={gear} /></Link>
            </li>
        );
        
        console.log(sessionsItems);

        return (
            <div className="list-border">
                <h2>Sessions</h2>
                <ul className="list-inner">
                    <li className="tt-head"><span className="session-name">Session Name</span><span className="lesson-name">Lecture Name</span><span className="participant-count">Participant Count</span><span className="manage-head">Manage</span></li>
                    {sessionsItems}
                </ul>
            </div>
            
        );
    };
}

export default TeacherSessionTable;
