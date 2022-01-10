import React, {useEffect, useState } from "react";
import NavBar from "../../Components/NavBar/NavBar";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import LessonPlanSectionListItem from "../../Components/LessonPlanSectionListItem/LessonPlanSectionListItem";
import LessonPlanEditor from "../../Components/LessonPlanEditor/LessonPlanEditor";
import { useDispatch } from "react-redux";
import { loadLessonPlan } from "./teacherLessonPlanSlice";
import {useAppSelector } from "../../Redux/hooks";

export interface PlanSection {
    name:string,
    section_type:string,
    elements:CHElement[]
}

export interface CHElement{
    el_type:string,
    props:CHElementProps,
    children:CHElementChild
}

export interface CHElementProps{
}

interface CHElementChild{
    JSX?:CHElement[]
    String?:string
}

export interface EditorElementChange{
    type:string,
    new_value?:string,
    id:number,
    section_id:number
}

export interface EditorElementNew{
    section_id:number
}

const TeacherLessonPlan: React.FC<{}> = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const planSections:PlanSection[] = useAppSelector((state) => state.planSections);
    const [selectedSection,setSelectedSection] =useState<number>(-1);
    
    // First load
    useEffect(() => {
        let plan_name = location.pathname.split("/").slice(-1)[0]
        axios.get("/plan/info/" + plan_name)
        .then((response) => {
            dispatch(loadLessonPlan(response.data as PlanSection[]))
        })
        .catch(() => console.error("Request failed"))
    },[location.pathname, dispatch]) 

    // On plan section change
    useEffect(() => {
        if (planSections.length >= 1){
            setSelectedSection(0);
        }
        else{
            setSelectedSection(-1)
        }
    }, [planSections])

    
    const renderSectionsList = () => {
        return planSections.map((section) => {
            return <LessonPlanSectionListItem key={section.name} section={section}></LessonPlanSectionListItem>
        })
    }

    const renderLessonPlanEditor = () => {

        if (selectedSection !== -1){
            return <LessonPlanEditor plan_section={planSections[selectedSection]} section_id={selectedSection}></LessonPlanEditor>
        }
        else{
            return <div>Add a section to get started</div>
        }
    }

    return(<div className="full-page">
                <NavBar small></NavBar>
                <div>
                    {renderSectionsList()}
                    {renderLessonPlanEditor()}
                </div>
            </div>
    );
}

export default TeacherLessonPlan;
