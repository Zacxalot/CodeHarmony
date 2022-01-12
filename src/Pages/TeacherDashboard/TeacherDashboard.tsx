import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import TeacherSessionTable from "../../Components/TeacherTable/TeacherSessionTable";
import Modal from 'react-modal';
import LargeLinkButton from "../../Components/LargeLinkButton/LargeLinkButton";
import LargeCallbackButton from "../../Components/LargeCallbackButton/LargeCallbackButton";
import { Navigate } from "react-router";
import "./TeacherDashboard.scss";
import CHButton from "../../Components/Basic UI/CHButton/CHButton";
import axios, { AxiosError } from "axios";
import TeacherPlanTable from "../../Components/TeacherTable/TeacherPlanTable";

interface TeacherDashboardState {
    newLessonModalOpen: boolean;
    newPlanNameValue: String;
    newPlanErrorString: String;
    openNewPlan: string;
    sessions:Session[];
    plans:Plan[];
}

interface CreateNewPlanResponse {
    plan_name:string,
    msg:string
}

interface PlanListResponse{
    plans:Plan[]
}

export interface Session {
    session_name: String,
    lesson_name: String,
    participant_count: Number
}

export interface Plan {
    plan_name: String
}


class TeacherDashboard extends React.Component<{},TeacherDashboardState> {

    constructor(props:any){
        super(props);
        this.state = {
            newLessonModalOpen: false,
            newPlanNameValue: "",
            newPlanErrorString:"",
            openNewPlan:"",
            sessions:[
                {session_name:"Session test", lesson_name:"Lesson test", participant_count:23},
            ],
            plans:[
                {plan_name:"Session test"}
            ]
        }
    }

    render(){
        if(this.state.openNewPlan !== ""){
            return(<Navigate to={"/t/plan/" + this.state.openNewPlan}/>)
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
                <div style={{textAlign:"center",display:"flex", flexDirection:"column"}}>
                    <TeacherSessionTable sessions={this.state.sessions}></TeacherSessionTable>
                    <TeacherPlanTable plans={this.state.plans}></TeacherPlanTable>
                </div>
                
            </div>
        );
    };

    componentDidMount(){
        axios.get<PlanListResponse>("/plan/list")
        .then(planlist => {
            this.setState({plans:planlist.data.plans})
        })
        .catch(err => {
            console.log(err)
        })
    }

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
            if(err.response?.status === 400){
                this.setState({newPlanErrorString:"Plan name already in use"})
            }
            else{
                this.setState({newPlanErrorString:"There was a problem. Please try again later"})
            }
        })
    }
}

export default TeacherDashboard;
