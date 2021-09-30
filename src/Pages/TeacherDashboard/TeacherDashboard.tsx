import React from "react";
import {
    Link
  } from "react-router-dom";
import NavBar from "../../Components/NavBar/NavBar";
import TeacherTable from "../../Components/Basic UI/TeacherTable/TeacherTable";
import CHButton from "../../Components/Basic UI/CHButton/CHButton";


class TeacherDashboard extends React.Component {

    render(){
        return (
            <div className="full-page">
                <NavBar small></NavBar>
                <Link to="/t/create">
                    <CHButton text="New Lesson" fontBlack></CHButton>
                </Link>
                
                <div style={{textAlign:"center"}}>
                    <TeacherTable></TeacherTable>   
                </div>
                
            </div>
        );
    };
    
}

export default TeacherDashboard;
