export const PLACES_STATES = {
    FREE: "free",
    BUSY: "busy",
    RESERVED: "reserved",
    UNKNOWN: "unknown",
};

export const parseJSON = (jsonString: string) => {
    try {
        return JSON.parse(jsonString);
    } catch (e) {}
    return {};
};
export const JtoS = (obj: object) => {
    return JSON.stringify(obj);
};
