import { useSubareas } from "@/hooks/useSubareas";
import SubareaCard from "./SubareaCard";

type SubareaListProp = {
    areaId: string;
};

const SubareaList: React.FC<SubareaListProp> = ({ areaId }) => {
    const { data, isLoading } = useSubareas(areaId);

    if (isLoading)
        return (
            <div className="animate-pulse text-[10px] font-black uppercase tracking-widest text-text/20">
                Loading...
            </div>
        );

    return (
        <div className="flex flex-row flex-wrap gap-4">
            {data &&
                "data" in data &&
                data.data.map((subarea) => (
                    <SubareaCard
                        key={subarea.id}
                        subarea={{
                            ...subarea,
                            created_at: new Date(subarea.created_at),
                            updated_at: new Date(subarea.updated_at),
                        }}
                    />
                ))}
        </div>
    );
};
export default SubareaList;
