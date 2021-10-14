import React from "react";
import "./RunbarButton.scss";
import runImg from "../../Vectors/run.svg";

interface ButtonProps {
    icon: string;
    callback: () => void;
    colour?: string;
    backgroundColour?: string;
}

//Objects to define icon paths and alt text
const altIconNames:{[key:string]:string} = {
    run:"Run Icon"
}

const iconPaths:{[key:string]:string} = {
    run:runImg
}

class RunbarButton extends React.Component<ButtonProps,{}> {
    render(){
        let {colour, backgroundColour} = this.props;

        // Assign a default colour of black
        if (colour === undefined){
            colour = "#000000";
        }

        // Assign a default colour of purple
        if (backgroundColour === undefined){
            backgroundColour = "#886ce4";
        }

        return (
            <button className="runbar-button button-hover" style={{backgroundColor:backgroundColour}} onClick={this.props.callback}>
                <img className="runbar-button-icon" draggable="false" alt={altIconNames[this.props.icon]} src={iconPaths[this.props.icon]}/>
                <span style={{display:"block"}}>Run</span>
            </button>
        );
    };
}

export default RunbarButton;
