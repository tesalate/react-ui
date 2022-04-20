import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import localForage from 'localforage';

const config: AxiosRequestConfig = {
  baseURL: `${process.env.REACT_APP_API_URL}/v1`,
  timeout: 200000,
  withCredentials: true,
};

const instance: AxiosInstance = axios.create(config);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && originalRequest.url.includes('/auth/verify-email')) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && originalRequest.url.includes('/auth/refresh-tokens')) {
      // await instance.post('/auth/logout');
      await localForage.removeItem('persist:root');
      await localForage.removeItem('persist:user');
      localStorage.removeItem('persist:root');
      localStorage.removeItem('persist:user');
      sessionStorage.removeItem('loggedIn');
      window.location.assign('/login');
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return instance.post('/auth/refresh-tokens').then((res) => {
        if (res.status === 204) {
          return instance(originalRequest);
        }
      });
    }
    return Promise.reject(error);
  }
);

export default {
  get: instance.get,
  post: instance.post,
  put: instance.put,
  delete: instance.delete,
  patch: instance.patch,
};
