import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import TeacherTable from "../../Components/Basic UI/TeacherTable/TeacherTable";
import Modal from 'react-modal';
import LargeLinkButton from "../../Components/LargeLinkButton/LargeLinkButton";
import LargeCallbackButton from "../../Components/LargeCallbackButton/LargeCallbackButton";
import { Navigate } from "react-router";
import "./TeacherDashboard.scss";
import CHButton from "../../Components/Basic UI/CHButton/CHButton";
import axios, { AxiosError } from "axios";
import { throwStatement, TYPESCRIPT_TYPES } from "@babel/types";
import { Map } from "typescript";

interface TeacherDashboardState {
    newLessonModalOpen: boolean;
    newPlanNameValue: String;
    newPlanErrorString: String;
    openNewPlan: string;
}

interface CreateNewPlanResponse {
    plan_name:string,
    msg:string
}

interface Blah {
    fwaawfaw:string,
    hawah:string
}



class TeacherDashboard extends React.Component<{},TeacherDashboardState> {
    errorTypes = new Map([
        ["-1","Badness"],
        ["-3","Plan name already in use"]
    ])

    constructor(props:any){
        super(props);
        this.state = {
            newLessonModalOpen: false,
            newPlanNameValue: "",
            newPlanErrorString:"",
            openNewPlan:""
        }
    }

    render(){
        if(this.state.openNewPlan !== ""){
            return(<Navigate to={"/plan/" + this.state.openNewPlan}/>)
        }

        return (
            <div className="full-page">
                <NavBar small></NavBar>
                <Modal ariaHideApp={false} className="new-lesson-modal-style" isOpen={this.state.newLessonModalOpen} onRequestClose={this.closeCreateLessonModal}>
                    <h4>Create New Lesson Plan</h4>
                    <span>
                        <label>Name:</label>
                        <input onChange={this.lessonNameChanged} type="text" maxLength={128}></input>
                    </span>
                    <span className="error">
                        {this.state.newPlanErrorString}
                    </span>
                    
                    <CHButton text="Create" disabled={this.state.newPlanNameValue.length < 4} fontBlack colour="#8bf535" callback={this.requestNewLessonPlan}></CHButton>
                </Modal>
                
                <div >
                    <LargeLinkButton to="session/new/" emoji="👨‍🏫️">New Session</LargeLinkButton>
                    <LargeCallbackButton callback={this.openCreateLessonModal} emoji="✍️">New Lesson Plan</LargeCallbackButton>
                </div>
                <div style={{textAlign:"center"}}>
                    <TeacherTable></TeacherTable>   
                </div>
                
            </div>
        );
    };

    openCreateLessonModal = () => {
        this.setState({newPlanNameValue:"",newLessonModalOpen:true,newPlanErrorString:""})
    }

    closeCreateLessonModal = () => {
        this.setState({newLessonModalOpen:false})
    }

    lessonNameChanged = (event:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({newPlanNameValue:event.target.value})
    }

    requestNewLessonPlan = () => {
        axios.post<CreateNewPlanResponse>("/plan/new",{"plan_name":this.state.newPlanNameValue})
        .then((response) => {
            this.setState({openNewPlan:response.data.plan_name})
        })
        .catch((err: AxiosError) => {
            let response = err.response?.data as CreateNewPlanResponse;
            if(response !== undefined){
                let errorText = this.errorTypes.get(response.plan_name);
                if(errorText !== undefined) {
                    this.setState({newPlanErrorString:errorText})
                }
                else{
                    this.setState({newPlanErrorString:"There was a problem, please try again later"})
                }
            }
            else{

            }
            
        })
    }
}

export default TeacherDashboard;
