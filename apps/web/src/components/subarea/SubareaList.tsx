import { useSubareas } from "@/hooks/useSubareas";
import SubareaCard from "./SubareaCard";

type SubareaListProp = {
    areaId: string;
};

const SubareaList: React.FC<SubareaListProp> = ({ areaId }) => {
    const { data, isLoading, error } = useSubareas(areaId);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error || !data || !("ok" in data) || !data.ok) {
        return <div>Error loading subareas.</div>;
    }
    console.log(data);
    if (data.data.length === 0) {
        return <p className="text-xs text-gray-400 italic">No subareas yet.</p>;
    }
    return (
        <div className="flex flex-col gap-2">
            {data.data.map((subarea) => (
                <SubareaCard key={subarea.id} subarea={subarea} />
            ))}
        </div>
    );
};

export default SubareaList;
