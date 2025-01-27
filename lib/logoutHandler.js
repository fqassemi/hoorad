// Next
import { deleteCookie } from 'cookies-next';

// Libs
import revalidatePathHandler from './revalidateHandler';

const logoutHandler = (callback = () => {}) => {
   deleteCookie('courses_accessToken');
   deleteCookie('courses_refreshToken');
   deleteCookie('courses_isLogin');
   deleteCookie('phoneNumber')
   revalidatePathHandler('/', 'layout');
   callback();
};

export default logoutHandler;
