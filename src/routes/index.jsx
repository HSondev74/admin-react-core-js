import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';

// project imports
import MainRoutes from './MainRoutes';
import LoginRoutes from './AuthRoutes';
import { AuthProvider } from 'contexts/AuthContext';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Loader from '../presentation/components/Loader';

// ==============================|| ROUTING RENDER ||============================== //

// Create routes configuration with private and public routes
const routes = [
  {
    path: '/',
    element: <PrivateRoute />,
    children: [MainRoutes]
  },
  {
    path: '/',
    element: <PublicRoute />,
    children: [LoginRoutes]
  }
];

const router = createBrowserRouter(routes, { basename: import.meta.env.VITE_APP_BASE_NAME });

const AppRoutes = () => (
  <AuthProvider>
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  </AuthProvider>
);

export default AppRoutes;
