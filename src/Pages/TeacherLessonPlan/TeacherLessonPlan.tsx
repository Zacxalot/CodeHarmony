import React, { useEffect } from "react";
import NavBar from "../../Components/NavBar/NavBar";
import { useLocation } from 'react-router-dom';
import axios from "axios";

const TeacherLessonPlan: React.FC<{}> = () => {
    const location = useLocation();

    useEffect(() => {
        let plan_name = location.pathname.split("/").slice(-1)[0]

        axios.get("/plan/info",{data:{"plan_name":plan_name}})
        .then()
        .catch(() => console.log("Request failed"))
    })    

    return(<div className="full-page">
                <NavBar small></NavBar>
                <div>
                    
                </div>
            </div>
    );
}

export default TeacherLessonPlan;
