import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://api.adview.io',
    headers: {
        "Content-Type": "application/json",
    },
});