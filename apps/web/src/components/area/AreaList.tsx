import type { Area } from "@app/shared/types";
import React from "react";
import AreaCard from "./AreaCard";

interface AreaListProps {
    areas: Area[];
}

const AreaList: React.FC<AreaListProps> = ({ areas }) => {
    return (
        <div className="flex flex-col gap-3">
            {areas.map((area) => (
                <AreaCard area={area} />
            ))}
        </div>
    );
};

export default AreaList;
