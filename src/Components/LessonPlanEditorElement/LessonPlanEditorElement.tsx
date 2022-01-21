import { ChangeEvent, useEffect, useState} from "react";
import { CHElement } from "../../Pages/TeacherLessonPlan/TeacherLessonPlan"
import "./LessonPlanEditorElement.scss"
import up_arrow from "../../Vectors/up.svg"
import down_arrow from "../../Vectors/down.svg";
import { useDispatch } from "react-redux";
import { updateElement } from "../../Pages/TeacherLessonPlan/teacherLessonPlanSlice";
import CHElementComponent from "../CHElementComponent/CHElementComponent";

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
        // Clear the text value if the element is set to image
        if (e.target.value === "img"){
            setTextValue("")
            dispatch(updateElement({type:"child",new_value:"",id,section_id}))
        }

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


    const handleTextboxChange = (e:ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) => {
        dispatch(updateElement({type:"child",new_value:e.target.value,id,section_id}))
        setTextValue(e.target.value)
    }

    const renderInput = () => {
        if(element.el_type === "img"){
            return <input className="textbox" onChange={handleTextboxChange} value={textValue}></input>
        }
        else{
            return <textarea className="textbox" onChange={handleTextboxChange} value={textValue}></textarea>
        }
    }

    return <div className="editor-element-container">
            <div className="editor-preview">
                <CHElementComponent element={element}/>
            </div>
            <div className="editor-options">
                <div className="options-container" >
                    <select value={element.el_type} onChange={handleTypeChange}>
                        <option value="h1">Heading</option>
                        <option value="p">Paragraph</option>
                        <option value="img">Image</option>
                    </select>
                    {renderInput()}
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