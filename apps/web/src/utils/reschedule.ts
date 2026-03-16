interface Area {
    areaId: string;
    areaName: string;
    weight: number;
    subareas: Subarea[];
}

interface Subarea {
    subareaName: string;
    subareaId: string;
    weight: number;
}

export const calcGlobalWeightedTime = (data: Area[], totalMinutes: number) => {
    // Weight task x weight genre x total time / total ( all weight task x weight genre)
    console.log(data);
    const subareas = data.flatMap((area) =>
        area.subareas.flatMap((subarea) => ({
            name: subarea.subareaName,
            subareaId: subarea.subareaId,
            parentArea: area.areaName,
            subareaWeight: subarea.weight,
            weight: area.weight * subarea.weight,
        })),
    );
    const totalScore = subareas.reduce(
        (acc: number, sub) => acc + sub.weight,
        0,
    );
    console.log(subareas);
    const result = subareas.map((subarea) => ({
        subarea: subarea.name,
        id: subarea.subareaId,
        area: subarea.parentArea,
        weight: subarea.subareaWeight,
        allocated: Math.round((subarea.weight / totalScore) * totalMinutes),
    }));

    return result;
};
export const calcNestedWeightedTime = (data: Area[], totalMinutes: number) => {
    console.log(data);
    // Wight task x weight genre x total time /  (total weight task di genre tersebut x total weight genre)
    const areaSumWeight = data.reduce((a: number, b) => a + b.weight, 0);

    const result = data.flatMap((area) => {
        const areaMinutes = (area.weight / areaSumWeight) * totalMinutes;
        const subAreaSumWeight = area.subareas.reduce(
            (a: number, b) => a + b.weight,
            0,
        );
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

    return result;
};
