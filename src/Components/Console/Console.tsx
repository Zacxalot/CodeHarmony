import React, { RefObject } from "react";
import "./Console.scss";

interface ConsoleProps {
}

interface ConsoleState{
    contents:String,
    signal:String|null
}

class Console extends React.Component<ConsoleProps,ConsoleState> {
    scrollRef:RefObject<HTMLPreElement>;

    constructor(props:ConsoleProps){
        super(props);
        this.state = {contents:"",signal:null};
        this.scrollRef = React.createRef();
    }

    render(){
        let contents = this.state.contents;
        if (this.state.signal === "SIGKILL"){
            contents += "\nOutput truncated"
        }

        return (
            <div className="console-container">
                <pre ref={this.scrollRef} className="console">
                    {contents}
                </pre>
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
