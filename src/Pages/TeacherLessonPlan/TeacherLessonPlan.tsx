import React, {useEffect, useRef, useState } from "react";
import NavBar from "../../Components/NavBar/NavBar";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import LessonPlanSectionListItem from "../../Components/LessonPlanSectionListItem/LessonPlanSectionListItem";
import LessonPlanEditor from "../../Components/LessonPlanEditor/LessonPlanEditor";
import { useDispatch } from "react-redux";
import { clearChangedFlag, createNewSection, loadLessonPlan, setSectionOrders } from "./teacherLessonPlanSlice";
import {useAppSelector } from "../../Redux/hooks";
import "./TeacherLessonPlan.scss";

export interface PlanSection {
    name:string,
    section_type:string,
    elements:CHElement[],
    order_pos:number,
    changed:boolean
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
    const [newSectionName,setNewSectionName] = useState<string>("");
    const plan_name = location.pathname.split("/").slice(-1)[0]

    // Timer that waits before changes stop before sending update request
    const updateTimer = useRef<NodeJS.Timeout>();
    
    
    // First load
    useEffect(() => {
        axios.get("/plan/info/" + plan_name)
        .then((response) => {
            let sections = response.data as PlanSection[]
            dispatch(loadLessonPlan(sections))
            if (sections.length > 0){
                setSelectedSection(0)
            }

        })
        .catch(() => console.error("Request failed"))
    },[plan_name, dispatch]) 

    // On plan section change
    useEffect(() => {

        // Uploads changes of sections to API
        // Called by the update timer below
        const uploadPlan = () => {

            for(let i = 0; i < planSections.length;i++){
                dispatch(setSectionOrders())

                if(planSections[i].changed){
                    axios.put("/plan/info/" + plan_name,planSections[i])
                    .then((response) => {
                    })
                    .catch(() => console.error("Upload failed"))
                    
                }
            }

            // Clear out all of the "changed" flags 
            dispatch(clearChangedFlag())

            // Disable the reload blocker
            window.onbeforeunload = null
        }

        if (planSections.length >= 1){

            // Reset the timer
            if(updateTimer.current !== undefined){
                clearTimeout(updateTimer.current);
            }
            updateTimer.current = setTimeout(uploadPlan,3000)

            // Prevent the reload while updating database
            window.onbeforeunload = () => {
                return true;
            };
        }
        else{
            setSelectedSection(-1)
        }
    }, [dispatch, planSections, plan_name])

    
    const renderSectionsList = () => {
        return planSections.map((section, index) => {
            return <LessonPlanSectionListItem key={section.name} section_name={section.name} position={index} callback={changeSection}></LessonPlanSectionListItem>
        })
    }

    const renderLessonPlanEditor = () => {

        if (selectedSection !== -1){
            return (<div>
                <h1>{planSections[selectedSection].name}</h1>
                <LessonPlanEditor plan_section={planSections[selectedSection]} section_id={selectedSection}></LessonPlanEditor>
            </div>)
        }
        else{
            return <div>Add a section to get started</div>
        }
    }

    // Request to add a new section to the plan
    const addNewSection = () => {
        var newName = newSectionName

        axios.post("/plan/info/" + plan_name, {request:"new-section", data:{section_name:newSectionName,order_pos:planSections.length}})
        .then((response) => {
            dispatch(createNewSection({name:newName,section_type:"LECTURE",elements:[],order_pos:planSections.length,changed:false}));
        })
        .catch(() => console.error("Request failed"))
    }

    // Passed to the section list items as a callback
    const changeSection = (index:number) => {
        setSelectedSection(index)
    }

    return(<div className="full-page">
                <NavBar small></NavBar>
                <div className="lesson-plan-container">
                    <div className="section-options-container">
                        <h1>Sections</h1>
                        <ul>
                            {renderSectionsList()}
                        </ul>
                        <form action="" onSubmit={e => {e.preventDefault(); addNewSection()}} className="new-section-container">
                            <input onChange={e => {setNewSectionName(e.target.value)}} className="new-section-name-box" type="text"></input>
                            <input type="submit" value="Add" className="new-section-button button-hover"></input>
                        </form>
                        
                    </div>
                    {renderLessonPlanEditor()}
                </div>
            </div>
    );
}

export default TeacherLessonPlan;
