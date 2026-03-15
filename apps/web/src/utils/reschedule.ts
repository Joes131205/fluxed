export const calcGlobalWeightedTime = (data: any, totalMinutes: number) => {
    // Weight task x weight genre x total time / total ( all weight task x weight genre)
    const subareas = data.flatMap((area) =>
        area.subareas.flatMap((subarea) => ({
            name: subarea.subareaName,
            subareaId: subarea.subareaId,
            parentArea: area.areaName,
            weight: area.weight * subarea.weight,
        })),
    );
    const totalScore = subareas.reduce((acc, sub) => acc + sub.weight, 0);
    console.log(subareas);
    const result = subareas.map((subarea) => ({
        subarea: subarea.name,
        id: subarea.subareaId,
        area: subarea.parentArea,
        allocated: Math.round((subarea.weight / totalScore) * totalMinutes),
    }));

    return result;
};
export const calcNestedWeightedTime = (data: any, totalMinutes: number) => {
    // Wight task x weight genre x total time /  (total weight task di genre tersebut x total weight genre)
    const areaSumWeight = data.reduce((a, b) => a + b.weight, 0);

    const result = data.flatMap((area) => {
        const areaMinutes = (area.weight / areaSumWeight) * totalMinutes;
        const subAreaSumWeight = area.subareas.reduce(
            (a, b) => a + b.weight,
            0,
        );
        return area.subareas.map((subarea) => ({
            subarea: subarea.subareaName,
            id: subarea.subareaId,
            area: area.areaName,
            allocated: Math.round(
                (subarea.weight / subAreaSumWeight) * areaMinutes,
            ),
        }));
    });

    return result;
};
