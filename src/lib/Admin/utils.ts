import { myFetch } from "../utils";
import { cars, macs } from "./adminStore";

export const getMacs = async () => {
    myFetch("/macs").then((data) => {
        macs.set(data);
    });
};

let parkingIdSave = "";

export const getCars = async (parkingId?: string) => {
    if (parkingId) {
        parkingIdSave = parkingId;
    } else {
        parkingId = parkingIdSave;
    }
    if (!parkingId) {
        return;
    }
    myFetch("/cars/" + parkingId).then((data) => {
        cars.set(data);
    });
};
