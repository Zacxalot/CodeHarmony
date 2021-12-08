import { PlanSection } from "../../Pages/TeacherLessonPlan/TeacherLessonPlan"
import LessonPlanEditorElement from "../LessonPlanEditorElement/LessonPlanEditorElement"
import "./LessonPlanEditor.scss"

interface LessonPlanEditorProps {
    plan_section:PlanSection
}

const LessonPlanEditor: React.FC<LessonPlanEditorProps> = ({plan_section}) => {
    const renderSectionElements = () => {
        return plan_section.elements.map((element, index) => {
            return <LessonPlanEditorElement element={element} key={index.toString()}></LessonPlanEditorElement>
        })
    }


    if (plan_section.section_type === "undefined"){
        return(<div>To get started, add a new section!</div>)
    }
    else{
        return(<div className="editor-elements">{renderSectionElements()}</div>)
    }

}

export default LessonPlanEditor