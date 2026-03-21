export const getTimeline = (data: any) => {
    const allBlocks = data.flatMap((item: any) => item.busy);

    return allBlocks.sort(
        (a: any, b: any) =>
            new Date(a.start).getTime() - new Date(b.start).getTime(),
    );
};
