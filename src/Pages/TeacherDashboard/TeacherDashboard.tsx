import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import TeacherTable from "../../Components/Basic UI/TeacherTable/TeacherTable";
import Modal from 'react-modal';
import LargeLinkButton from "../../Components/LargeLinkButton/LargeLinkButton";
import LargeCallbackButton from "../../Components/LargeCallbackButton/LargeCallbackButton";

interface TeacherDashboardState {
    newLessonModalOpen: boolean;
}


class TeacherDashboard extends React.Component<{},TeacherDashboardState> {
    constructor(props:any){
        super(props);
        this.state = {
            newLessonModalOpen: false
        }
    }

    render(){
        console.log("Rendered" + this.state.newLessonModalOpen);
        return (
            <div className="full-page">
                <NavBar small></NavBar>
                <Modal isOpen={this.state.newLessonModalOpen} onRequestClose={this.closeCreateLessonModal}></Modal>
                <div style={{textAlign:"center"}}>
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
    
}

export default TeacherDashboard;
