import { EditorElementChange, PlanSection } from "../../Pages/TeacherLessonPlan/TeacherLessonPlan"
import LessonPlanEditorElement from "../LessonPlanEditorElement/LessonPlanEditorElement"
import "./LessonPlanEditor.scss"

interface LessonPlanEditorProps {
    plan_section:PlanSection,
    callback:(event:EditorElementChange) => void
}

const LessonPlanEditor: React.FC<LessonPlanEditorProps> = ({plan_section,callback}) => {
    const renderSectionElements = () => {
        return plan_section.elements.map((element, index) => {
            return <LessonPlanEditorElement element={element} key={index.toString()} id={index} callback={callback}></LessonPlanEditorElement>
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