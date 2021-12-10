import react, { ChangeEvent, useEffect, useState} from "react";
import { CHElement } from "../../Pages/TeacherLessonPlan/TeacherLessonPlan"
import "./LessonPlanEditorElement.scss"
import up_arrow from "../../Vectors/up.svg"
import down_arrow from "../../Vectors/down.svg";
import { useDispatch } from "react-redux";
import { updateElement } from "../../Pages/TeacherLessonPlan/teacherLessonPlanSlice";

interface LessonPlanEditorElementProps {
    element: CHElement,
    section_id:number,
    id: number
}

const LessonPlanEditorElement: React.FC<LessonPlanEditorElementProps> = ({ element, section_id, id }) => {

    const [textValue, setTextValue] = useState(element.children.String)
    const dispatch = useDispatch();

    useEffect(() => {
        setTextValue(element.children.String)
    }, [element.children.String])

    const handleTypeChange = (e:ChangeEvent<HTMLSelectElement>) => {
        dispatch(updateElement({type:"eltype",new_value:e.target.value,id,section_id}))
    }

    const handlePositionUp = (e:React.MouseEvent<HTMLElement>) => {
        dispatch(updateElement({type:"move",new_value:"up",id,section_id}))
        console.log("Up")
    }

    const handlePositionDown = (e:React.MouseEvent<HTMLElement>) => {
        dispatch(updateElement({type:"move",new_value:"down",id,section_id}))
        console.log("Down")
    }


    const handleTextboxChange = (e:ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(updateElement({type:"child",new_value:e.target.value,id,section_id}))
        setTextValue(e.target.value)
        console.log(e.target.value)
    }

    console.log("rendered")
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
                    <textarea className="textbox" onChange={handleTextboxChange} value={textValue}></textarea>
                </div>
                
                <div className="arrow-container">
                    <span onClick={handlePositionUp} className="arrow-button button-hover">
                        <img  src={up_arrow} className="arrow-image" alt="up arrow"></img>
                    </span>
                    <span  onClick={handlePositionDown} className="arrow-button arrow-button-down button-hover">
                        <img src={down_arrow} className="arrow-image" alt="down arrow"></img>
                    </span>
                </div>
            </div>

        </div>
}

export default LessonPlanEditorElement