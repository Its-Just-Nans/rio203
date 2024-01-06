export const myFetch = (url: string, method = "GET", body = {}) => {
    return fetch("/api" + url, {
        body: JSON.stringify(body),
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    }).then((res) => res.json());
};
let token = "";

export const setToken = (newToken: string) => {
    token = newToken;
};

//TODO: this is not a secure way to generate tokens
export const generateToken = () => {
    const r = () => Math.random().toString(36).substring(2);
    return r() + r() + r() + r() + r() + r() + r() + r();
};
