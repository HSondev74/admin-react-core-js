import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, ReactNode } from 'react';

// project imports
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import { AuthProvider } from '@/contexts/AuthContext';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Loader from '@/components/Loader';

// Type definitions
type RouteConfig = {
  path: string;
  element: ReactNode;
  children?: RouteConfig[];
};

// ==============================|| ROUTING RENDER ||============================== //

// Create routes configuration with private and public routes
const routes: RouteConfig[] = [
  {
    path: '/',
    element: <PrivateRoute />,
    children: [MainRoutes as unknown as RouteConfig] // Type assertion for now
  },
  {
    path: '/',
    element: <PublicRoute />,
    children: [AuthRoutes as unknown as RouteConfig] // Type assertion for now
  }
];

const router = createBrowserRouter(routes, { 
  basename: import.meta.env.VITE_APP_BASE_NAME 
});

const AppRoutes = () => (
  <AuthProvider>
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  </AuthProvider>
);

export default AppRoutes;
