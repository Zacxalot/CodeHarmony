import React from "react";
import "./TeacherTable.scss";
import gear from "../../Vectors/gear.svg";
import { Link } from "react-router-dom";
import {Plan} from "../../Pages/TeacherDashboard/TeacherDashboard";

interface TeacherTableProps {
    plans:Plan[]
}



class TeacherPlanTable extends React.PureComponent<TeacherTableProps,{}> {
    constructor(props:any){
        super(props);
    }

    render(){
        const planItems = this.props.plans.map((plan) => 
            <li className="tt-item">
                <span className="session-name">{plan.plan_name}</span>
                <Link to={"/plan/" + plan.plan_name} className="manage-button"><img alt="Gear symbol" src={gear} /></Link>
            </li>
        );
        
        console.log(planItems);

        return (
            <ul className="list-border">
                <li><h2>Plans</h2></li>
                <li className="tt-head"><span className="session-name">Plan Name</span><span className="manage-head">Manage</span></li>
               {planItems}
            </ul>
        );
    };
}

export default TeacherPlanTable;
