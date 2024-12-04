import axios from "axios";


const httpAxios = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    withCredentials: true
});


export {
    httpAxios
}