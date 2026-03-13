import type { Area } from "@app/shared/types";
import React from "react";
import AreaCard from "./AreaCard";

interface AreaListProps {
    areas: Area[];
}

const AreaList: React.FC<AreaListProps> = ({ areas }) => {
    if (!areas || areas.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                <p className="text-sm">
                    No areas yet. Create one to get started.
                </p>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-4">
            {areas.map((area) => (
                <AreaCard key={area.id} area={area} />
            ))}
        </div>
    );
};

export default AreaList;
