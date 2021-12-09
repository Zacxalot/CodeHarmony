import react, { ChangeEvent} from "react";
import { CHElement, EditorElementChange } from "../../Pages/TeacherLessonPlan/TeacherLessonPlan"
import "./LessonPlanEditorElement.scss"
import up_arrow from "../../Vectors/up.svg"
import down_arrow from "../../Vectors/down.svg";

interface LessonPlanEditorElementProps {
    element: CHElement,
    callback: (event:EditorElementChange) => void,
    id: number
}



const LessonPlanEditorElement: React.FC<LessonPlanEditorElementProps> = ({ element, callback,id }) => {

    const handleTypeChange = (e:ChangeEvent<HTMLSelectElement>) => {
        callback({type:"eltype",new_value:e.target.value,id:id})
    }

    return <div className="editor-element-container">
            <div className="editor-preview">
                {react.createElement(element.el_type, element.props, element.children.String)}
            </div>
            <div className="editor-options">
                <div className="options-container" >
                    <select value={element.el_type} onChange={handleTypeChange}>
                        <option value="h1">Heading</option>
                        <option value="p">Paragraph</option>
                    </select>
                </div>
                
                <div className="arrow-container">
                    <span className="arrow-button button-hover">
                        <img  src={up_arrow} className="arrow-image" alt="up arrow"></img>
                    </span>
                    <span className="arrow-button arrow-button-down button-hover">
                        <img src={down_arrow} className="arrow-image" alt="down arrow"></img>
                    </span>
                </div>
            </div>

        </div>
}

export default LessonPlanEditorElement