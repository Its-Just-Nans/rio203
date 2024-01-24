export type Place = {
    idPlace?: number;
    selected: boolean;
    a1: number[];
    a2: number[];
    a3: number[];
    a4: number[];
    type: string;
    plaque: string;
    name: string;
    state: string;
    time: number;
    ip: string;
};

export type Parking = {
    idParking: number;
    name: string;
    schema: string;
    idAdmin: number;
};
