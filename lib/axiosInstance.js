/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import toast from 'react-hot-toast';
import logoutHandler from './logoutHandler';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
   baseURL,
});

const refreshAccessToken = async refreshToken => {
   try {
      const response = await axiosInstance.post('retoken', {
         refresh_token: refreshToken,
      });
      const newAccessToken = response.data?.access_token;
      setCookie('courses_accessToken', newAccessToken, { maxAge: 60 * 60 * 24 * 365 });
      return newAccessToken;
   } catch (error) {
      throw new Error(error);
   }
};

const expiredFunctionality = () => {
   logoutHandler(() => {
      location.href = '/login';
   });
   toast.error('لطفا ابتدا وارد حساب کاربری خود شوید');
};

axiosInstance.interceptors.request.use(
   config => {
      const accessToken = getCookie('courses_accessToken');

      if (accessToken) {
         config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
   },
   error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
   response => {
      const message = response?.data?.message ?? response?.data?.detail;
      if (message) {
         toast.success(message);
      }
      return response;
   },
   async error => {
      console.log(error);
      const refreshToken = getCookie('courses_refreshToken');
      const originalReq = error.config;
      const errorMessage =
         error?.response?.data?.message ?? error?.response?.data?.detail ?? error?.response?.data?.error;

      switch (errorMessage) {
         case 'Access token has expired': {
            // Access token expired
            if (refreshToken) {
               const newAccessToken = await refreshAccessToken(refreshToken);
               originalReq.headers.Authorization = `Bearer ${newAccessToken}`;
               return axiosInstance(originalReq);
            }
            expiredFunctionality();

            break;
         }

         case 'Refresh token expired': {
            // Refresh token expired
            expiredFunctionality();
            break;
         }

         default: {
            if (errorMessage) {
               toast.error(errorMessage);
            }
            break;
         }
      }

      return Promise.reject(error);
   }
);

export default axiosInstance;
