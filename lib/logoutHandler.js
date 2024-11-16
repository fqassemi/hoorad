import { deleteCookie } from 'cookies-next';

const logoutHandler = (callback = () => {}) => {
   deleteCookie('courses_accessToken');
   deleteCookie('courses_refreshToken');
   deleteCookie('courses_isLogin');
   callback();
};

export default logoutHandler;
