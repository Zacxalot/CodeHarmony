import React from "react";
import "./CHButton.scss";

interface ButtonProps {
    text: string;
    colour?: string;
    callback?: () => void;
    fontBlack?: boolean;
}

class CHButton extends React.Component<ButtonProps,{}> {

    render(){
        let {text, colour} = this.props;

        // Assign a default colour of green to the button
        if (colour === undefined){
            colour = "#65dd44";
        }

        return (
            <button className="ch-button" style={{ backgroundColor: colour, color: (this.props.fontBlack ? "black" : "white") }} onClick={this.props.callback}>{text}</button>
        );
    };


    
}

export default CHButton;
