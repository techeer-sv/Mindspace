import axios from 'axios';

const BASEURL = `localhost:8080/api/v1/`;
//TODO 향후 BASEURL부분은 env파일로 분리할 것

const instance = axios.create({
  baseURL: BASEURL,
});

instance.interceptors.request.use(
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

export default axios;
