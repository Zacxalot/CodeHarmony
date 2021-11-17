import React from "react";
import axios from "axios";
import Codemirror from "../../Components/Codemirror/Codemirror";
import NavBar from "../../Components/NavBar/NavBar";
import Console from "../../Components/Console/Console";
import CodingInfoWindow from "../../Components/CodingInfoWindow/CodingInfoWindow";
import RunbarButton from "../../Components/RunbarButton/RunbarButton";

import "./StudentCoding.scss";

interface CodeSendResponse {
    language:string,
    run:{
        stdout:string,
        signal:string | null
    },
    version:string
}

class StudentCoding extends React.Component {
    codemirrorRef: React.RefObject<Codemirror>;
    consoleRef: React.RefObject<Console>;

    constructor(props:any){
        super(props);
        this.codemirrorRef = React.createRef();
        this.consoleRef = React.createRef();
    }
    
    render(){
        return (
            <div className="full-page student-coding">
                <NavBar small></NavBar>

                <div className="coding-flex">
                    <div className="codemirror-container">
                        <Codemirror ref={this.codemirrorRef}></Codemirror>
                    </div>

                    <div className="info-console">
                        <CodingInfoWindow></CodingInfoWindow>
                        <Console ref={this.consoleRef}></Console>
                        <div className="runbar-container">
                            <div className="runbar">
                                <RunbarButton icon="run" callback={this.runCode}></RunbarButton>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            
        );
    };



    runCode = () => {
        let code;
        
        // Get code from the Codemirror
        if (this.codemirrorRef.current !== null){
            code = this.codemirrorRef.current.getEditorState()?.join("\n");
        }


        if (code !== undefined){
            let sendCode = {
                "language": "python",
                "version":"3.9.4",
                "files":[
                    {
                        "name":"main.py",
                        "content":code
                    }
                ]
            }
    
            axios.post<CodeSendResponse>("/api/v2/execute",sendCode)
                 .then((response) => {
                     this.consoleRef.current?.setState({contents:response.data.run.stdout,signal:response.data.run.signal});
                     this.consoleRef.current?.scrollToBottom();
                 })
                 .catch(ex => {
                     console.log("Running code failed")
                     console.log(ex)
                 });
        }

        
        
    }
    
}

export default StudentCoding;