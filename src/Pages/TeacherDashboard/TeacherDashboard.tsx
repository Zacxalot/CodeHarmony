import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import TeacherTable from "../../Components/Basic UI/TeacherTable/TeacherTable";
import Modal from 'react-modal';
import LargeLinkButton from "../../Components/LargeLinkButton/LargeLinkButton";
import LargeCallbackButton from "../../Components/LargeCallbackButton/LargeCallbackButton";
import "./TeacherDashboard.scss";
import CHButton from "../../Components/Basic UI/CHButton/CHButton";
import axios from "axios";

interface TeacherDashboardState {
    newLessonModalOpen: boolean;
    newLessonNameValue: String;
}

interface CreateNewPlanResponse {
    id:string
}


class TeacherDashboard extends React.Component<{},TeacherDashboardState> {
    constructor(props:any){
        super(props);
        this.state = {
            newLessonModalOpen: false,
            newLessonNameValue: ""
        }
    }

    render(){
        return (
            <div className="full-page">
                <NavBar small></NavBar>
                <Modal ariaHideApp={false} className="new-lesson-modal-style" isOpen={true} onRequestClose={this.closeCreateLessonModal}>
                    <h4>Create New Lesson Plan</h4>
                    <span>
                        <label>Name:</label>
                        <input onChange={this.lessonNameChanged} type="text"></input>
                    </span>
                    
                    <CHButton text="Create" disabled={this.state.newLessonNameValue.length < 4} fontBlack colour="#8bf535" callback={this.requestNewLessonPlan}></CHButton>

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
        this.setState({newLessonModalOpen:true})
    }

    closeCreateLessonModal = () => {
        this.setState({newLessonModalOpen:false})
    }

    lessonNameChanged = (event:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({newLessonNameValue:event.target.value})
    }

    requestNewLessonPlan = () => {
        axios.post<CreateNewPlanResponse>("/lessons/create",{"lesson_name":this.state.newLessonNameValue})
        .then()
        .catch(() => {
            console.log("A problem has ocurred")
        })
    }
    
}

export default TeacherDashboard;
