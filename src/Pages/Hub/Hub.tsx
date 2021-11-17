import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    BrowserRouter
  } from "react-router-dom";
import HomePage from "../Home/Home";
import TeacherDashboard from "../TeacherDashboard/TeacherDashboard";
import PageNotFound from "../PageNotFound/PageNotFound";
import StudentCoding from "../StudentCoding/StudentCoding";
import TeacherLessonPlan from "../TeacherLessonPlan/TeacherLessonPlan";

class Hub extends React.Component {

    render(){
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/s/dashboard" element={<StudentCoding/>}/>
                    <Route path="/t/dashboard" element={<TeacherDashboard/>}/>
                    <Route path="/t/lesson-plan" element={<TeacherLessonPlan/>}/>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            </BrowserRouter>
        );
    };
    
}

export default Hub;
