import axios from "axios";

/**
 * @type {AxiosInstance}
 */
const axiosInstance = axios.create({
    baseURL: 'https://staging-api.rosa.be/api',
})

export default axiosInstance;