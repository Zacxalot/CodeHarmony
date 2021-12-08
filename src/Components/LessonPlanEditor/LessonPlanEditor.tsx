import react from "react"
import { PlanSection } from "../../Pages/TeacherLessonPlan/TeacherLessonPlan"


interface LessonPlanEditorProps {
    plan_section:PlanSection
}

const LessonPlanEditor: React.FC<LessonPlanEditorProps> = ({plan_section}) => {
    const renderSectionElements = () => {
        
        console.log("Rendering section elements");
        console.log(plan_section.elements);
        return plan_section.elements.map((element, index) => {
            element.props.key = index.toString();
            if (element.children.String){
                return react.createElement(element.el_type, element.props, element.children.String);
            }
            else{
                return react.createElement(element.el_type, element.props, element.children.JSX);
            }
        })
    }


    if (plan_section.section_type === "undefined"){
        return(<div>To get started, add a new section!</div>)
    }
    else{
        return(<div>{renderSectionElements()}</div>)
    }

}

export default LessonPlanEditor