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
      const newAccessToken = response.data?.access;
      setCookie('courses_accessToken', newAccessToken, { maxAge: 60 * 60 * 24 * 365 });
      return newAccessToken;
   } catch (error) {
      throw new Error('Token refresh failed');
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

      switch (error?.response?.data?.message) {
         case 'access token is not valid anymore': {
            // Access token expired
            if (refreshToken) {
               const newAccessToken = await refreshAccessToken(refreshToken);
               originalReq.headers.Authorization = `Bearer ${newAccessToken}`;
               return axiosInstance(originalReq);
            }
            expiredFunctionality();

            break;
         }

         case 'refresh token is not valid anymore': {
            // Refresh token expired
            expiredFunctionality();
            break;
         }

         default: {
            const errorMessage = error?.response?.data?.message ?? error?.response?.data?.detail;
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
