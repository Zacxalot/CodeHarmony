import { PlanSection } from "../../Pages/TeacherLessonPlan/TeacherLessonPlan"

interface LessonPlanSectionListItemProps {
    section:PlanSection
}

const LessonPlanSectionListItem: React.FC<LessonPlanSectionListItemProps> = ({section}) => {

    return(<div>{section.name}</div>)
}

export default LessonPlanSectionListItem