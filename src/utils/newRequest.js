import axios from "axios";

const newRequest = axios.create({
    baseURL: "https://wilsoftia-fiverr.fly.dev/api/",
    withCredentials: true
});

export default newRequest;