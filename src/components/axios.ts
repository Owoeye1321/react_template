// axios.js
import axios from 'axios';

//defaults.headers.common['Authorization'] = localStorage.getItem('zer') ? `Bearer ${JSON.parse(localStorage.getItem('zer')).token}` : null;

//Add a request interceptor
axios.interceptors.request.use(
   function (config: any) {
      // Do something before request is sent
      if (!config.headers.Authorization) {
         const zer = localStorage.getItem('zer');
         //   console.log(zer)
         // config.url += (config.url.split('?')[1] ? '&' : '?') + 'x-tag=' + 'opop';
         if (zer) {
            config.headers.Authorization = `Bearer ${zer}`;
         }
      }
      return config;
   },
   function (error) {
      // Do something with request error
      return Promise.reject(error);
   },
);

// // Add a response interceptor
axios.interceptors.response.use(
   function (response) {
      // Do something with response data
      return response;
   },
   function (error) {
      // Do something with response error
      // console.log(error, error.response);
      if (error.response && error.response.status === 401) {
         // alert('auth error, redirecting to login, disabled now')
         localStorage.removeItem("zer");
         // return (window.location.pathname = '/login');
      }

      // console.log(error.response)
      return Promise.reject(error);
   },
);

//export default axios;
export const patch = axios.patch;
export const get = axios.get;
export const post = axios.post;
export const put = axios.put;
export const delet = axios.delete;