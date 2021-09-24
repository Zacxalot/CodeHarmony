import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import "./PageNotFound.scss";

class PageNotFound extends React.Component {

    render(){
        return (
            <div className="full-page">
                <NavBar/>
                <div className=" page-not-found">
                    <span className="large-emoji">😥</span>
                    <h1>404</h1>
                    <h2>Not Found</h2>
                    <p>sorry...</p>
                </div>
            </div>
            
        );
    };
    
}

export default PageNotFound;