import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

// assets
import AuthCard from './AuthCard';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

export default function AuthWrapper({ children }) {
  return <AuthCard>{children}</AuthCard>;
}

AuthWrapper.propTypes = { children: PropTypes.node };
