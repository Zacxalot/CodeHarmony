import React from "react";
import './NavBar.scss';
import {Link} from "react-router-dom";

class NavBar extends React.Component {

    render(){
        return (
            <nav>
                <Link to={"/"}>
                    <h1>Code<span>_</span>Harmony</h1>
                </Link>
            </nav>
        );
    };
    
}

export default NavBar;


