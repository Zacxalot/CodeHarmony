import React, { RefObject } from "react";
import { getSupportedCodeFixes } from "typescript";
import "./Console.scss";

interface ConsoleProps {
}

interface ConsoleState{
    contents:String
}

class Console extends React.Component<ConsoleProps,ConsoleState> {
    scrollRef:RefObject<HTMLDivElement>;

    constructor(props:ConsoleProps){
        super(props);
        this.state = {contents:""};
        this.scrollRef = React.createRef();
    }

    render(){
        let contents = this.state.contents.split("\n");
        let lines = []

        for (const line of contents){
            lines.push(line)
            lines.push(<br/>)
        }

        return (
            <div className="console-container">
                <div ref={this.scrollRef} className="console">
                    {lines}
                </div>
            </div>
        );
    };
    

    scrollToBottom(){
        if (this.scrollRef.current?.scrollTop !== undefined){
            this.scrollRef.current.scrollTop = this.scrollRef.current.scrollHeight;
        }
        
    }
}

export default Console;
