import React from "react";
import './Home.scss';

class HomePage extends React.Component {

    render(){
        return (
            <div className="home-page">
                <nav>
                    <h1>Code_Harmony</h1>

                </nav>
                <div className="selection-card-align">
                    <div className="selection-card-area">
                        <div className="selection-card">
                            <a className="selection-card-link">
                                <h1>I'm a student</h1>
                                <span className="large-emoji">🙋</span>
                            </a>
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
