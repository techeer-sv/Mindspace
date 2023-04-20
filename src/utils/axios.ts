import axios from 'axios';

const BASEURL = `${process.env.REACT_APP_IP}/api/v1/`;
// 향후 BASEURL부분은 env파일로 분리할 것

const instance = axios.create({
  baseURL: BASEURL,
});

/**
 * 작성자 : 태원
 * 날짜 : 4/20
 * 내용 : 현재는 accessToken정보에 userId값을 담고 있지만 추후 실제 발급받은 토큰 정보를 보내야합니다.
 */
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
