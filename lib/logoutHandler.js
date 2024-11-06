import { deleteCookie } from 'cookies-next';

const logoutHandler = (callback = () => {}) => {
   deleteCookie('mahanClinic_accessToken');
   deleteCookie('mahanClinic_refreshToken');
   deleteCookie('mahanClinic_isLogin');
   callback();
};

export default logoutHandler;
