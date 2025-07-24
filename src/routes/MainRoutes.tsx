import { lazy, ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';

// project imports
import Loadable from '@/components/Loadable';
import DashboardLayout from '@/layout/Dashboard';

// Lazy load components
const DashboardDefault = Loadable(lazy(() => import('@/pages/dashboard/default')));
const Color = Loadable(lazy(() => import('@/pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('@/pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('@/pages/component-overview/shadows')));
const SamplePage = Loadable(lazy(() => import('@/pages/extra-pages/sample-page')));

// Define route types
type RouteConfig = {
  path: string;
  element: ReactNode;
  children?: RouteConfig[];
};

// Main routes configuration
const MainRoutes: RouteConfig = {
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
    }
  ]
};

export default MainRoutes;
