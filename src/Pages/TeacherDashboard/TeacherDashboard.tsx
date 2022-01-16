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
    newSessionModalOpen: boolean;
    newPlanNameValue: string;
    newSessionNameValue: string;
    newSessionPlanName:string;
    newPlanErrorString: string;
    openNewPlan: string;
    openNewSession: {plan_name:string, session_name:string};
    sessions:Session[];
    plans:Plan[];
}

interface CreateNewPlanResponse {
    plan_name:string,
    msg:string
}

interface CreateNewSessionResponse {
    plan_name:string,
    session_name:string,
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
    plan_name: string
}


class TeacherDashboard extends React.Component<{},TeacherDashboardState> {

    constructor(props:any){
        super(props);
        this.state = {
            newLessonModalOpen: false,
            newSessionModalOpen:false,
            newPlanNameValue: "",
            newSessionNameValue: "",
            newSessionPlanName:"",
            newPlanErrorString:"",
            openNewPlan:"",
            openNewSession:{plan_name:"", session_name:""},
            sessions:[],
            plans:[]
        }
    }

    render(){
        if(this.state.openNewPlan !== ""){
            return(<Navigate to={"/t/plan/" + this.state.openNewPlan}/>)
        }

        // Redirects to the session page when a new session is made
        if(this.state.openNewSession.plan_name !== ""){
            return(<Navigate to={"/t/session/" + this.state.openNewSession.plan_name + "/" + this.state.openNewSession.session_name}/>)
        }


        return (
            <div className="full-page">
                <NavBar small></NavBar>

                {/* New lesson plan modal */}
                <Modal ariaHideApp={false} className="new-lesson-modal-style" isOpen={this.state.newLessonModalOpen} onRequestClose={this.closeCreateLessonModal}>
                    <h4>Create New Lesson Plan</h4>
                    <span>
                        <label>Name:</label>
                        <input onChange={this.lessonNameChanged} type="text" maxLength={128}></input>
                    </span>
                    <span className="error">
                        {this.state.newPlanErrorString}
                    </span>
                    
                    <CHButton text="Create" disabled={this.state.newPlanNameValue.length < 4} fontBlack colour="#72e217" callback={this.requestNewLessonPlan}></CHButton>
                </Modal>
                
                <Modal ariaHideApp={false} className="new-lesson-modal-style" isOpen={this.state.newSessionModalOpen} onRequestClose={this.closeCreateSessionModal}>
                    <h4>Create New Session</h4>
                    <span>
                        <span>Plan Name: {this.state.newSessionPlanName}</span>
                        <label>Session Name:</label>
                        <input onChange={this.sessionNameChanged} type="text" maxLength={128}></input>
                    </span>
                    <CHButton text="Create" disabled={this.state.newSessionNameValue.length < 4} fontBlack colour="#72e217" callback={this.requestNewSession}></CHButton>
                </Modal>

                <div >
                    <LargeLinkButton to="session/new/" emoji="👨‍🏫️">New Session</LargeLinkButton>
                    <LargeCallbackButton callback={this.openCreateLessonModal} emoji="✍️">New Lesson Plan</LargeCallbackButton>
                </div>
                <div style={{textAlign:"center",display:"flex", flexDirection:"column"}}>
                    <TeacherSessionTable sessions={this.state.sessions}></TeacherSessionTable>
                    <TeacherPlanTable plans={this.state.plans} newSessionCallback={this.openCreateSessionModal}></TeacherPlanTable>
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

    openCreateSessionModal = (newSessionPlanName:string) => {
        this.setState({newPlanNameValue:"",newSessionModalOpen:true,newSessionPlanName:newSessionPlanName})
    }

    closeCreateSessionModal = () => {
        this.setState({newSessionModalOpen:false})
    }

    lessonNameChanged = (event:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({newPlanNameValue:event.target.value})
    }

    sessionNameChanged = (event:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({newSessionNameValue:event.target.value})
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

    requestNewSession = () => {
        axios.post<CreateNewSessionResponse>("/session/new/" + encodeURIComponent(this.state.newSessionPlanName) + "/" + encodeURIComponent(this.state.newSessionNameValue))
        .then((response) => {
            console.log(response)
            this.setState({openNewSession:{plan_name:response.data.plan_name, session_name:response.data.session_name}})
        })
        .catch((err: AxiosError) => {
            if(err.response?.status === 400){
            }
            else{
            }
        })
    }
}

export default TeacherDashboard;
