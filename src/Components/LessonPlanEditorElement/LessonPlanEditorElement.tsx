import react, { useMemo } from "react";
import { CHElement } from "../../Pages/TeacherLessonPlan/TeacherLessonPlan"
import "./LessonPlanEditorElement.scss"

interface LessonPlanEditorElementProps {
    element: CHElement
}

const LessonPlanEditorElement: React.FC<LessonPlanEditorElementProps> = ({ element }) => {
    let render = useMemo(() => {
        return <div className="editor-element-container">
            <div className="editor-preview">
                {react.createElement(element.el_type, element.props, element.children.String)}
            </div>
            <div className="editor-options">
                This is <br></br> a placeholder
            </div>

        </div>
    }, [element]);

    return render
}

export default LessonPlanEditorElement