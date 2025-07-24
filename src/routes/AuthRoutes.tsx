import { lazy, ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';

// project imports
import AuthLayout from '@/layout/Auth';
import Loadable from '@/components/Loadable';

// Lazy load components
const LoginPage = Loadable(lazy(() => import('@/pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('@/pages/auth/Register')));

// Define route types
type AuthRouteConfig = {
  path: string;
  element: ReactNode;
  children?: AuthRouteConfig[];
};

// ==============================|| AUTH ROUTING ||============================== //

const AuthRoutes: AuthRouteConfig = {
  path: '/',
  children: [
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        {
          path: '/login',
          element: <LoginPage />
        },
        {
          path: '/register',
          element: <RegisterPage />
        }
      ]
    }
  ]
};

export default AuthRoutes;
