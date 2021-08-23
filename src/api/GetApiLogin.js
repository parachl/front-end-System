import axios from "axios";

const baseURL = "http://localhost:8080/demo/";

const defaultOptionLogin = {
    baseURL,
    method:["GET"],
    headers: {
        Accept:"application/json",
    "Content-Type":"application/json; charset=utf-8",
    },
};
const api = axios.create(defaultOptionLogin);
export default api;