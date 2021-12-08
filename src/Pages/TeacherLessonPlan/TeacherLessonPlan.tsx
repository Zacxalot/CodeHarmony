import React, {useEffect, useMemo, useState } from "react";
import NavBar from "../../Components/NavBar/NavBar";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import LessonPlanSectionListItem from "../../Components/LessonPlanSectionListItem/LessonPlanSectionListItem";
import LessonPlanEditor from "../../Components/LessonPlanEditor/LessonPlanEditor";

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
    key:string
}

interface CHElementChild{
    JSX?:CHElement[]
    String?:string
}


const TeacherLessonPlan: React.FC<{}> = () => {
    const undefined_plan_section:PlanSection = useMemo(()=>{return({
        name: "undefined",
        section_type: "undefined",
        elements: []
    })
    },[])

    const location = useLocation();
    const [planSections,setPlanSections] = useState<PlanSection[]>([]);
    const [selectedSection,setSelectedSection] =useState<PlanSection>(undefined_plan_section);
    
    // First load
    useEffect(() => {
        let plan_name = location.pathname.split("/").slice(-1)[0]
        axios.get("/plan/info/" + plan_name)
        .then((response) => {
            console.log(response);
            setPlanSections(response.data as PlanSection[]);
        })
        .catch(() => console.error("Request failed"))


    },[location.pathname]) 

    // On plan section change
    useEffect(() => {
        console.log(planSections);
        if (planSections.length >= 1){
            setSelectedSection(planSections[0]);
        }
        else{
            setSelectedSection(undefined_plan_section)
        }

    }, [planSections, undefined_plan_section])
    
    const renderSectionsList = () => {
        return planSections.map((section) => {
            return <LessonPlanSectionListItem key={section.name} section={section}></LessonPlanSectionListItem>
        })
    }

    return(<div className="full-page">
                <NavBar small></NavBar>
                <div>
                    {renderSectionsList()}
                    <LessonPlanEditor plan_section={selectedSection}></LessonPlanEditor>
                </div>
            </div>
    );
}

export default TeacherLessonPlan;
