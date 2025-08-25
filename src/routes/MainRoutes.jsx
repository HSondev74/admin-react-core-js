import { lazy } from 'react';

// project imports
import Loadable from '../presentation/components/Loadable';
import DashboardLayout from '../presentation/components/layout/Dashboard';
import DictionaryPage from '../presentation/screen/dictionary';
import TimeKeepingPage from '../presentation/screen/timekeeping';
import WorkSchedulePage from '../presentation/screen/workschedule';

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
      path: 'user-mangement',
      element: <UserManagementPage />
    },
    {
      path: 'role-mangement',
      element: <RoleManagementPage />
    },
    {
      path: 'dictionary',
      element: <DictionaryPage />
    },
    {
      path: 'timekeeping',
      element: <TimeKeepingPage />
    },
    {
      path: 'workschedule',
      element: <WorkSchedulePage />
    }
  ]
};

export default MainRoutes;
