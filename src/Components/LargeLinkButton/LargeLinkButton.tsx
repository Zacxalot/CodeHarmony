
import React from "react";
import { Link } from "react-router-dom";
import "./LargeButton.scss";

interface LargeLinkButtonProps {
    to: string,
    emoji?: string
}


class LargeLinkButton extends React.Component<LargeLinkButtonProps,{}>{

    render(){
        return (
            <Link className="large-button" to={this.props.to}>
                {this.props.children}
                <span className="emoji">{this.props.emoji}</span>
            </Link>
        );
    };
    
}

export default LargeLinkButton;
