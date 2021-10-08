import React from "react";
import "./TeacherTable.scss";
import "./TeacherTableItem.scss";

import TeacherTableItem from "./TeacherTableItem";
import {Lesson} from "./TeacherTableItem";

interface TeacherTableState {
    lessons:Lesson[]
}



class TeacherTable extends React.Component<{},TeacherTableState> {
    constructor(props:any){
        super(props);

        this.state = {
            lessons: [
                {session_name:"Session test", lesson_name:"Lesson test", participant_count:23},
                {session_name:"Session test", lesson_name:"Lesson test", participant_count:23},
                {session_name:"Session test", lesson_name:"Lesson test", participant_count:23},
                {session_name:"Session test", lesson_name:"Lesson test", participant_count:23},
                {session_name:"Session test", lesson_name:"Lesson test", participant_count:23},
                {session_name:"Session test", lesson_name:"Lesson test", participant_count:23},
                {session_name:"Session test", lesson_name:"Lesson test", participant_count:23},
                {session_name:"Session test", lesson_name:"Lesson test", participant_count:23}

            ]
        }
    }

    render(){
        const lessonsItems = this.state.lessons.map((lesson) => <TeacherTableItem session_name={lesson.session_name} lesson_name={lesson.lesson_name} participant_count={lesson.participant_count}></TeacherTableItem>);
        


        return (
            <ul className="list-border">
                <li className="tt-head"><span className="session-name">Session Name</span><span className="lesson-name">Lecture Name</span><span className="participant-count">Participant Count</span><span className="manage-head">Manage</span></li>
               {lessonsItems}
            </ul>
        );
    };
}

export default TeacherTable;
