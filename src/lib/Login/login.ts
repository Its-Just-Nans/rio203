import { myFetch, setToken } from "../utils";
import { user } from "../stores";
import { parseJSON } from "../../../shared/constants";

const LOGIN_KEY = "login";

export const login = (username: string, password: string) => {
    myFetch("/login", "POST", { username, password }).then((data) => {
        setToken(data.token);
        user.set(data.user);
        localStorage.setItem(LOGIN_KEY, JSON.stringify({ username, password }));
    });
};

export const checkLogin = () => {
    const item = localStorage.getItem(LOGIN_KEY);
    if (item) {
        const { username, password } = parseJSON(item);
        login(username, password);
    }
};

export const register = async (username: string, password: string, plaque: string) => {
    myFetch("/register", "POST", { username, password, plaque });
};

export const logout = () => {
    myFetch("/logout", "POST").then(() => {
        user.set(null);
        localStorage.removeItem(LOGIN_KEY);
    });
};
