import React from "react";
import "./TeacherTable.scss";
import gear from "../../Vectors/gear.svg";
import { Link } from "react-router-dom";
import {Session} from "../../Pages/TeacherDashboard/TeacherDashboard";

interface TeacherTableProps {
    sessions:Session[]
}



class TeacherSessionTable extends React.PureComponent<TeacherTableProps,{}> {
    constructor(props:any){
        super(props);
    }

    render(){
        const sessionsItems = this.props.sessions.map((session) => 
            <li className="tt-item">
                <span className="session-name">{session.session_name}</span>
                <span className="lesson-name">{session.lesson_name}</span>
                <span className="participant-count">{session.participant_count}</span>
                <Link to="manage/" className="manage-button"><img alt="Gear symbol" src={gear} /></Link>
            </li>
        );
        
        console.log(sessionsItems);

        return (
            <ul className="list-border">
                <li><h2>Sessions</h2></li>
                <li className="tt-head"><span className="session-name">Session Name</span><span className="lesson-name">Lecture Name</span><span className="participant-count">Participant Count</span><span className="manage-head">Manage</span></li>
               {sessionsItems}
            </ul>
        );
    };
}

export default TeacherSessionTable;
