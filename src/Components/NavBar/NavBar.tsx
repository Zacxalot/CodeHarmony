import React from "react";
import "./NavBar.scss";
import {Link} from "react-router-dom";

interface NavBarProps {
    small?: boolean
}

class NavBar extends React.Component<NavBarProps,{}> {
    

    render(){
        return (
            // Use a smaller font size if the small prop is given
            <nav style={{fontSize: ((this.props.small) ? "1rem" : "2rem")}}>
                <Link to={"/"}>
                    <h1>Code<span>_</span>Harmony</h1>
                </Link>
            </nav>
        );
    };
    
}

export default NavBar;


