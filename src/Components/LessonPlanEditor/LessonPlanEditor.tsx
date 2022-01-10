import { PlanSection } from "../../Pages/TeacherLessonPlan/TeacherLessonPlan"
import LessonPlanEditorElement from "../LessonPlanEditorElement/LessonPlanEditorElement"
import { useDispatch } from "react-redux";
import { addNewElement } from "../../Pages/TeacherLessonPlan/teacherLessonPlanSlice";
import "./LessonPlanEditor.scss"

interface LessonPlanEditorProps {
    plan_section:PlanSection,
    section_id:number
}

const LessonPlanEditor: React.FC<LessonPlanEditorProps> = ({plan_section,section_id}) => {
    const dispatch = useDispatch();

    const renderSectionElements = () => {
        return plan_section.elements.map((element, index) => {
            return <LessonPlanEditorElement element={element} key={index.toString()} section_id={section_id} id={index}></LessonPlanEditorElement>
        })
    }

    const handleAddNewElement = (e:React.MouseEvent<HTMLElement>) => {
        dispatch(addNewElement({section_id:section_id}))
        console.log("Down")
    }

    if (plan_section.section_type === "undefined"){
        return(<div>To get started, add a new section!</div>)
    }
    else{
        return(
        <div className="editor-elements">
            {renderSectionElements()}
            <span onClick={handleAddNewElement} className="editor-element-container button-hover add-element-button">+</span>
        
        </div>)
    }

}

export default LessonPlanEditor