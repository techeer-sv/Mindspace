import axios from 'axios';

// FIXME 백엔드 CORS에러 수정 시 http://localhost:8080추가 및 json의 proxy 지우기

const BASEURL = '/api/v1/';
// TODO 향후 BASEURL부분은 env파일로 분리할 것

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
