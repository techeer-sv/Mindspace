import axios from 'axios';

const BASEURL = `${process.env.REACT_APP_IP}/api/v1/`;
// 향후 BASEURL부분은 env파일로 분리할 것

const instance = axios.create({
  baseURL: BASEURL,
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.log('axiosInstance request Error');
    return Promise.reject(error);
  },
);

export default axios;
