import "./LessonPlanSectionListItem.scss"
interface LessonPlanSectionListItemProps {
    section_name:String,
    position:number,
    callback:(index:number) => void
}

const LessonPlanSectionListItem: React.FC<LessonPlanSectionListItemProps> = ({section_name,position,callback}) => {
    const handleSelect = (e:React.MouseEvent<HTMLElement>) => {
        callback(position)
    }

    return(<li onClick={handleSelect} className="lesson-plan-section-item button-hover">
        <span>{section_name}</span>
    </li>)
}

export default LessonPlanSectionListItem