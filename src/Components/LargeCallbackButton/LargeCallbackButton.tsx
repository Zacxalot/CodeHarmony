
import React from "react";
import "../LargeLinkButton/LargeButton.scss";

interface LargeCallbackButtonProps {
    callback: () => void,
    emoji?: string
}



class LargeCallbackButton extends React.Component<LargeCallbackButtonProps,{}>{

    render(){
        return (
            <button className="large-button" onClick={this.props.callback}>
                {this.props.children}
                <span className="emoji">{this.props.emoji}</span>
            </button>
        );
    };
    
}

export default LargeCallbackButton;
