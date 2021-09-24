import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import HomePage from "../Home/Home";
import PageNotFound from "../PageNotFound/PageNotFound";

class Hub extends React.Component {

    render(){
        return (
            <Router>
                <Switch>
                    <Route path="/s/dashboard"/>
                    <Route exact path="/" component={HomePage}/>
                    <Route component={PageNotFound}/>
                </Switch>
                

                

            </Router>
        );
    };
    
}

export default Hub;
