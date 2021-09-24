import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import './Home.scss';
import NavBar from "../../Components/NavBar/NavBar";

class HomePage extends React.Component {

    render(){
        return (
            <div className="full-page">
                <NavBar></NavBar>
                <div className="selection-card-align">
                    <div className="selection-card-area">
                        <div className="selection-card">
                            <Link to={"/s/dashboard"} className="selection-card-link">
                                <h1>I'm a student</h1>
                                <span className="large-emoji">🙋</span>
                            </Link>
                        </div>
                        <div className="selection-card">
                            <a className="selection-card-link">
                                <h1>I'm a teacher</h1>
                                <span className="large-emoji">👨‍🏫️</span>
                            </a>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    };
    
}

export default HomePage;
