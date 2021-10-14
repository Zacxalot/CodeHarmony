import React from "react";
import Codemirror from "../../Components/Codemirror/Codemirror";
import NavBar from "../../Components/NavBar/NavBar";
import Console from "../../Components/Console/Console";
import CodingInfoWindow from "../../Components/CodingInfoWindow/CodingInfoWindow";

import "./StudentCoding.scss";
class StudentCoding extends React.Component {

    render(){
        return (
            <div className="full-page student-coding">
                <NavBar small></NavBar>

                <div className="coding-flex">
                    <div className="codemirror-container">
                        <Codemirror></Codemirror>
                    </div>

                    <div className="info-console">
                        <CodingInfoWindow></CodingInfoWindow>
                        <Console></Console>
                        <div className="runbar-container">
                            <div className="runbar">
                                Test
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            
        );
    };
    
}

export default StudentCoding;