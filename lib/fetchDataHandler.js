// Next
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const getTokens = async () => {
   const cookieStore = await cookies();
   const accessToken = cookieStore.get('courses_accessToken')?.value;
   const refreshToken = cookieStore.get('courses_refreshToken')?.value;

   return { accessToken, refreshToken };
};

const API_BASE_URL = process?.env?.NEXT_PUBLIC_API_BASE_URL;

const fetchDataHandler = async (endpoint, options = {}, hasToken, baseUrl = API_BASE_URL) => {
   const { accessToken, refreshToken } = await getTokens();

   const headers = {
      ...(options.headers || {}),
      ...(hasToken && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
   };

   const requestDetails = {
      url: `${baseUrl}${endpoint}`,
      options: { ...options, headers },
   };

   const expiredFunctionality = async () => {
      const cookieStore = await cookies();
      cookieStore.delete('courses_accessToken');
      cookieStore.delete('courses_refreshToken');
      cookieStore.delete('courses_isLogin');

      if (requestDetails.options.headers?.Authorization) {
         delete requestDetails.options.headers.Authorization;
      }
      const response = await fetch(requestDetails.url, requestDetails.options);
      const responseData = await response?.json();

      if (response?.ok) {
         return responseData;
      }

      const expiredResponseMessage = responseData?.message ?? responseData?.detail ?? responseData?.error;

      if (expiredResponseMessage === 'Bearer token is required in the Authorization header') {
         redirect('/login');
      }

      return responseData;
   };

   const refreshAccessToken = async () => {
      const response = await fetch(`${baseUrl}retoken`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            refresh_token: refreshToken,
         }),
      });

      if (response?.ok) {
         const responseData = await response?.json();
         const newAccessToken = responseData?.access_token;
         headers.Authorization = `Bearer ${newAccessToken}`;
      }

      // Refresh token expired
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message ?? errorData?.detail ?? errorData?.error;
      if (errorMessage === 'Refresh token expired') {
         return expiredFunctionality();
      }

      return null;
   };

   const response = await fetch(requestDetails.url, requestDetails.options);
   if (response?.ok) {
      return response.json();
   }
   const errorData = await response.json().catch(() => null);
   const errorMessage = errorData?.message ?? errorData?.detail ?? errorData?.error;
   console.log('server error message =>', errorMessage);

   if (errorMessage === 'Token has expired') {
      // Access token expired
      if (refreshToken) {
         await refreshAccessToken();
         const newResponse = await fetch(requestDetails.url, requestDetails.options);
         if (newResponse?.ok) {
            return newResponse.json();
         }
      } else {
         return expiredFunctionality();
      }
   } else if (errorMessage === 'Bearer token is required in the Authorization header') {
      redirect('/login');
   } else if (errorMessage) {
      return errorMessage;
   }

   return null;
};

export default fetchDataHandler;
