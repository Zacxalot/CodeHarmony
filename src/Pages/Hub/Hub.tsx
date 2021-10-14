import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import HomePage from "../Home/Home";
import TeacherDashboard from "../TeacherDashboard/TeacherDashboard";
import PageNotFound from "../PageNotFound/PageNotFound";
import StudentCoding from "../StudentCoding/StudentCoding";

class Hub extends React.Component {

    render(){
        return (
            <Router>
                <Switch>
                    <Route path="/s/dashboard" component={StudentCoding}/>
                    <Route path="/t/dashboard" component={TeacherDashboard}/>
                    <Route exact path="/" component={HomePage}/>
                    <Route component={PageNotFound}/>
                </Switch>
                

                

            </Router>
        );
    };
    
}

export default Hub;
