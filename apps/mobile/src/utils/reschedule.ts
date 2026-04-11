type Area = {
    areaId: string;
    areaName: string;
    weight: number;
    subareas: Subarea[];
};

type Subarea = {
    subareaName: string;
    subareaId: string;
    weight: number;
};

export const calcGlobalWeightedTime = (data: Area[], totalMinutes: number) => {
    const subareas = data.flatMap((area) =>
        area.subareas.map((subarea) => ({
            name: subarea.subareaName,
            subareaId: subarea.subareaId,
            parentArea: area.areaName,
            subareaWeight: subarea.weight,
            weight: area.weight * subarea.weight,
        })),
    );

    const totalScore = subareas.reduce((acc, sub) => acc + sub.weight, 0);

    if (!totalScore) {
        return [];
    }

    return subareas.map((subarea) => ({
        subarea: subarea.name,
        id: subarea.subareaId,
        area: subarea.parentArea,
        weight: subarea.subareaWeight,
        allocated: Math.round((subarea.weight / totalScore) * totalMinutes),
    }));
};

export const calcNestedWeightedTime = (data: Area[], totalMinutes: number) => {
    const areaSumWeight = data.reduce((acc, area) => acc + area.weight, 0);

    if (!areaSumWeight) {
        return [];
    }

    return data.flatMap((area) => {
        const areaMinutes = (area.weight / areaSumWeight) * totalMinutes;
        const subAreaSumWeight = area.subareas.reduce(
            (acc, subarea) => acc + subarea.weight,
            0,
        );

        if (!subAreaSumWeight) {
            return [];
        }

        return area.subareas.map((subarea) => ({
            subarea: subarea.subareaName,
            id: subarea.subareaId,
            area: area.areaName,
            weight: subarea.weight,
            allocated: Math.round(
                (subarea.weight / subAreaSumWeight) * areaMinutes,
            ),
        }));
    });
};
