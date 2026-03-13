export const calcGlobalWeightedTime = (data: any) => {
    // Weight task x weight genre x total time / total ( all weight task x weight genre)
    const weightArea = data.reduce((a, b) => a + b.weight, 0);
};
export const calcNestedWeightedTime = (data: any) => {
    // Wight task x weight genre x total time /  (total weight task di genre tersebut x total weight genre)
    const weightArea = data.reduce((a, b) => a + b.weight, 0);
};
