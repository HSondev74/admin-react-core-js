import { lazy } from 'react';

// project imports
import AuthLayout from '../presentation/components/layout/Auth';
import Loadable from '../presentation/components/Loadable';

// jwt auth
const LoginPage = Loadable(lazy(() => import('../presentation/screen/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('../presentation/screen/auth/Register')));

// ==============================|| AUTH ROUTING ||============================== //

const AuthRoutes = {
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
