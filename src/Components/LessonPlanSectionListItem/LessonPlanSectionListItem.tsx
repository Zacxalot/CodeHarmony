import { PlanSection } from "../../Pages/TeacherLessonPlan/TeacherLessonPlan"
import "./LessonPlanSectionListItem.scss"
interface LessonPlanSectionListItemProps {
    section:PlanSection
}

const LessonPlanSectionListItem: React.FC<LessonPlanSectionListItemProps> = ({section}) => {
    return(<li>
        <span>{section.name}</span>
        
    </li>)
}

export default LessonPlanSectionListItem