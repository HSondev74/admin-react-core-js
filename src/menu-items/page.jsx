// assets
import { LoginOutlined, ProfileOutlined, UserOutlined, TeamOutlined, ReadOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  UserOutlined,
  TeamOutlined,
  ReadOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    {
      id: 'login1',
      title: 'Login',
      type: 'item',
      url: '/login',
      icon: icons.LoginOutlined
    },
    {
      id: 'register1',
      title: 'Register',
      type: 'item',
      url: '/register',
      icon: icons.ProfileOutlined,
      children: [
        {
          type: 'button',
          parentId: '5',
          path: '',
          menuId: '6',
          title: 'sửa kho',
          icon: 'faUser4',
          roleName: 'hrm_kho_edit',
          children: [
            {
              type: 'list',
              parentId: '2',
              path: '/abc',
              menuId: '4',
              title: 'Quản lý nhân viên',
              icon: 'faUser1',
              roleName: 'hrm_user_abc'
            }
          ]
        }
      ]
    },
    {
      id: 'user-mangement',
      title: 'Quản lý người dùng',
      type: 'item',
      url: '/user-mangement',
      icon: icons.UserOutlined
    },
    {
      id: 'role-mangement',
      title: 'Quản lý chức vụ',
      type: 'item',
      url: '/role-mangement',
      icon: icons.TeamOutlined
    },
    {
      id: 'dictionary',
      title: 'Quản lý từ điển',
      type: 'item',
      url: '/dictionary',
      icon: icons.ReadOutlined
    }
  ]
};

export default pages;
