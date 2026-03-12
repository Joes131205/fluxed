import type { Area } from "@app/shared/types";
import SubareaList from "../subarea/SubareaList";

type AreaProp = {
    area: Area;
};

const AreaCard: React.FC<AreaProp> = ({ area }) => {
    return (
        <div>
            <p>{area.name}</p>
            <p>{area.id}</p>
            <p>{area.weight}</p>

            <div>
                <p>Subareas</p>
                <SubareaList areaId={area.id} />
            </div>
        </div>
    );
};

export default AreaCard;
