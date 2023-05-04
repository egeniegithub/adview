import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://adview.io',
    headers: {
        "Content-Type": "application/json",
    },
});