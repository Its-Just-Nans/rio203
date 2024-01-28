let stack: { [s: string]: any[] } = {};

export const getLatestClient = (parkingId: string) => {
    if (!stack[parkingId]) {
        stack[parkingId] = [];
    }
    const latest = stack[parkingId].shift();
    console.log("latest", latest);
    return latest;
};

export const addToStack = (parkingId: string, data: any) => {
    if (!stack[parkingId]) {
        stack[parkingId] = [];
    }
    stack[parkingId].push(data);
};

export const getStack = (parkingId: string) => {
    if (!stack[parkingId]) {
        stack[parkingId] = [];
    }
    return stack[parkingId];
};
