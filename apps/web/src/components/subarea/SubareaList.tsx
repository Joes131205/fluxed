import { useSubareas } from "@/hooks/useSubareas";
import type { Subarea } from "@app/shared/types";
import SubareaCard from "./SubareaCard";

type SubareaListProp = {
    areaId: string;
};

const SubareaList: React.FC<SubareaListProp> = ({ areaId }) => {
    const { data: subareas }: { data: Subarea[] } = useSubareas(areaId);
    return (
        <div className="flex flex-col gap-3">
            {subareas.map((subarea) => (
                <SubareaCard subarea={subarea} />
            ))}
        </div>
    );
};

export default SubareaList;
