import axios from "axios";
const baseURL = "http://localhost:8080/tax/";
// const baseURL = "https://dev-smws.thailife.com:8443/wsTaxSpring/";


const defaultOptions = {
    baseURL,
    method: ["GET"],
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
    },
};

const api = axios.create(defaultOptions);
export default api;
