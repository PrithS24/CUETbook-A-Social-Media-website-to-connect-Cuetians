import axios from "axios";

const ApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
console.log("API URL", ApiUrl)

const axiosInstance = axios.create({
    baseURL: ApiUrl.trim(),
    withCredentials: true
})

console.log("Axios Base URL after creation:", axiosInstance.defaults.baseURL);

export default axiosInstance;