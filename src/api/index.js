import authApi from './auth';
import usersApi from './users';
import { useGetMenuMaster, handlerDrawerOpen } from './menu';

export { authApi, usersApi, useGetMenuMaster, handlerDrawerOpen };

export default {
  auth: authApi,
  users: usersApi,
  menu: {
    useGetMenuMaster,
    handlerDrawerOpen
  }
};
