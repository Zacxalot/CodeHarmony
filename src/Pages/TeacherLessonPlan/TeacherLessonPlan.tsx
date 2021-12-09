import React, {useEffect, useState } from "react";
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

export interface EditorElementChange{
    type:string,
    new_value?:string,
    id:number
}

const TeacherLessonPlan: React.FC<{}> = () => {
    // const undefined_plan_section:PlanSection = useMemo(()=>{return({
    //     name: "undefined",
    //     section_type: "undefined",
    //     elements: []
    // })
    // },[])

    const location = useLocation();
    const [planSections,setPlanSections] = useState<PlanSection[]>([]);
    const [selectedSection,setSelectedSection] =useState<number>(-1);
    
    // First load
    useEffect(() => {
        let plan_name = location.pathname.split("/").slice(-1)[0]
        axios.get("/plan/info/" + plan_name)
        .then((response) => {
            setPlanSections(response.data as PlanSection[]);
        })
        .catch(() => console.error("Request failed"))


    },[location.pathname]) 

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

    const handleEditorEvent = (event:EditorElementChange) => {
        console.log("HANDLE ME")
        if(event.type === "eltype" && event.new_value){
            
            
        }
    }

    console.log("Something happened");

    const renderLessonPlanEditor = () => {
        console.log("Rendering Teacher Lesson Plan");

        if (selectedSection !== -1){
            return <LessonPlanEditor plan_section={planSections[selectedSection]} callback={handleEditorEvent}></LessonPlanEditor>
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
