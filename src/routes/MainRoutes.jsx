import { lazy } from 'react';

// project imports
import Loadable from '../presentation/components/Loadable';
import DashboardLayout from '../presentation/components/layout/Dashboard';
import MenuManagement from '../presentation/screen/component-overview/menu';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('../presentation/screen/dashboard/default')));

// render - color
const Color = Loadable(lazy(() => import('../presentation/screen/component-overview/color')));
const Typography = Loadable(lazy(() => import('../presentation/screen/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('../presentation/screen/component-overview/shadows')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('../presentation/screen/extra-pages/sample-page')));

// lazy loading page
const UserManagementPage = Loadable(lazy(() => import('../presentation/screen/users')));
const RoleManagementPage = Loadable(lazy(() => import('../presentation/screen/roles')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />,
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'users',
      element: <UserManagementPage />
    },
    {
      path: 'roles',
      element: <RoleManagementPage />
    },
    {
      path: 'settings',
      element: <MenuManagement /> // Placeholder for settings page
    },
    {
      path: 'setup-menu',
      element: <SamplePage /> // Placeholder for setup menu page
    }
  ]
};

export default MainRoutes;
