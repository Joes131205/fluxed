import { useAreas } from "@/hooks/useAreas";
import AreaList from "../area/AreaList";

export const AreaSection = () => {
    const { data: areasData } = useAreas();
    return (
        <div className="flex flex-col gap-5 p-5">
            <h2 className="text-2xl font-bold text-gray-900">Your Areas</h2>

            <AreaList
                areas={
                    areasData && areasData.ok
                        ? areasData.data.map((area) => ({
                              ...area,
                              created_at: new Date(area.created_at),
                              updated_at: new Date(area.updated_at),
                          }))
                        : []
                }
            />
        </div>
    );
};
