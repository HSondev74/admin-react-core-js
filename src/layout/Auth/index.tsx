import { JSX } from 'react';
import { Outlet } from 'react-router-dom';

// ==============================|| LAYOUT - AUTH ||============================== //

/**
 * Authentication layout component
 * Wraps authentication pages like login, register, forgot password, etc.
 */
const AuthLayout = (): JSX.Element => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthLayout;
