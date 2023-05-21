import axios from 'axios';

const VERSION = 'api/v1/';
const BASEURL = `${process.env.REACT_APP_HOST}${VERSION}`;

const baseAxios = axios.create({
  baseURL: BASEURL,
});

baseAxios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.log('axiosInstance request Error');
    return Promise.reject(error);
  },
);

export default baseAxios;
