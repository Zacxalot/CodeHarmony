import React from "react";
import "./Console.scss";

interface ConsoleProps {
    stdout: string;
}

class Console extends React.Component<ConsoleProps,{}> {

    render(){
        return (
            <textarea className="console"  readOnly value={this.props.stdout}></textarea>
        );
    };
    
}

export default Console;
