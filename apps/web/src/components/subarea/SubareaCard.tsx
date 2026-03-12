import type { Subarea } from "@app/shared/types";
import EventList from "../event/EventList";

type SubareaProp = {
    subarea: Subarea;
};

const SubareaCard: React.FC<SubareaProp> = ({ subarea }) => {
    return (
        <div>
            <p>{subarea.name}</p>
            <p>{subarea.id}</p>
            <p>{subarea.weight}</p>

            <div>
                <p>Events</p>
                <EventList subareaId={subarea.id} />
            </div>
        </div>
    );
};

export default SubareaCard;
