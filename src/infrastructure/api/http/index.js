import authApi from './auth';
import usersApi from './users';
import { useGetMenuMaster, useGetMenuTree, handlerDrawerOpen } from './menu';

export { authApi, usersApi, useGetMenuMaster, useGetMenuTree, handlerDrawerOpen };

export default {
  auth: authApi,
  users: usersApi,
  menu: {
    useGetMenuMaster,
    useGetMenuTree,
    handlerDrawerOpen
  }
};
