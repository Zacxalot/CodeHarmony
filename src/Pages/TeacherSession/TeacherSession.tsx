import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../../Components/NavBar/NavBar";
import { PlanSection } from "../TeacherLessonPlan/TeacherLessonPlan";
import left_arrow from "../../Vectors/left black.svg"
import right_arrow from "../../Vectors/right black.svg";
import "./TeacherSession.scss"
import CHElementComponent from "../../Components/CHElementComponent/CHElementComponent";


interface LessonSession{
    plan:PlanSection[],
    session:SessionInfo
}

interface SessionInfo{
    date:number
}


const TeacherSession: React.FC<{}> = () => {
    const location = useLocation();
    const plan_name = location.pathname.split("/").slice(-2)[0]
    const session_name = location.pathname.split("/").slice(-1)[0]

    const [planSections,setPlanSections] = useState<PlanSection[]>();
    const [currentSection,setCurrentSection] = useState<number>(0);

    // First load
    useEffect(() => {
        console.log(plan_name)
        axios.get<LessonSession>("/session/info/" + plan_name + "/" + session_name)
        .then((lesson_session) => {
            setPlanSections(lesson_session.data.plan)
        })
        .catch(() => console.error("Request failed"))
    },[plan_name,session_name]) 

    const renderElements = () => {
        if (planSections !== undefined && currentSection < planSections.length && currentSection >= 0){
            return planSections[currentSection].elements.map((element, index) => {
                return <CHElementComponent element={element} key={index}/>
            })
        }
        else{
            return <span>Could not display section!</span>
        }
        
    }

    const renderSectionsTitle = () => {
        if (planSections !== undefined && currentSection < planSections.length && currentSection >= 0){
            return <span className="title-flex">{planSections[currentSection].name}</span>
        }
        else{
            return <span>No Section Selected</span>
        }
    }

    const regressSection = () => {
        if (planSections !== undefined && currentSection > 0){
            setCurrentSection(currentSection - 1)
        }
    }

    const advanceSection = () => {
        if (planSections !== undefined && currentSection < planSections.length - 1){
            setCurrentSection(currentSection + 1)
        }
    }

    return(
    <div className="full-page">
        <NavBar small></NavBar>
        <div className="page-container">
            <div className="sections-picker">
                <span className="arrow-flex button-hover arrow-left" onClick={() => regressSection()}><img className="arrow-image" alt="Left arrow"  src={left_arrow} draggable="false"/></span>
                {renderSectionsTitle()}
                <span className="arrow-flex button-hover arrow-right" onClick={() => advanceSection()}><img className="arrow-image" alt="Right arrow" src={right_arrow} draggable="false"/></span>
            </div>
            {renderElements()}
        </div>
    </div>)
}

export default TeacherSession;