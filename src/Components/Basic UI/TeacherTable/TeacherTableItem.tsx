import React from "react";
import "./TeacherTableItem.scss";
import gear from "../../../Vectors/gear.svg";
import {Link} from "react-router-dom";

export interface Lesson {
    session_name: String,
    lesson_name: String,
    participant_count: Number
}



class TeacherTableItem extends React.Component<Lesson,{}> {

    render(){
        return (
            <li className="tt-item">
                <span className="session-name">{this.props.session_name}</span>
                <span className="lesson-name">{this.props.lesson_name}</span>
                <span className="participant-count">{this.props.participant_count}</span>
                <Link to="manage/" className="manage-button"><span>Manage</span><img alt="Gear symbol" src={gear} /></Link>
            </li>      
        );
    };
}

export default TeacherTableItem;
