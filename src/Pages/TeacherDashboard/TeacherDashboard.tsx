import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import TeacherTable from "../../Components/Basic UI/TeacherTable/TeacherTable";


class TeacherDashboard extends React.Component {

    render(){
        return (
            <div className="full-page">
                <NavBar small></NavBar>
                
                <div style={{textAlign:"center"}}>
                    <TeacherTable></TeacherTable>   
                </div>
                
            </div>
        );
    };
    
}

export default TeacherDashboard;
