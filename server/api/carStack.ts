let stack: any[] = [];

export const getLatestClient = async () => {
    return stack.shift();
};

export const addToStack = (data: any) => {
    stack.push(data);
}