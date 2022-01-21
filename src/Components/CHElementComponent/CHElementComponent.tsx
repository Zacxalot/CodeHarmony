import react from "react"
import { CHElement } from "../../Pages/TeacherLessonPlan/TeacherLessonPlan"
import "./CHElementComponent.scss"

interface CHElementComponentProps{
    element: CHElement
}

function renderElementPreview(element:CHElement){
    if(element.el_type === "img"){
        return react.createElement(element.el_type, element.props)
    }
    else{
        return react.createElement(element.el_type, element.props, element.children.String)
    }
}

function CHElementComponent({element}:CHElementComponentProps){
    return <div className="element-preview">
        {renderElementPreview(element)}
        </div>
    
}

export default CHElementComponent