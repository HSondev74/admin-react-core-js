import PropTypes from 'prop-types';
// project imports
import MainCard from '../../MainCard';

// ==============================|| AUTHENTICATION - CARD WRAPPER ||============================== //

export default function AuthCard({ children, ...other }) {
  return (
    <MainCard
      content={false}
      {...other}
      border={false}
      boxShadow
      shadow={(theme) => theme.customShadows.z1}
    >
      {children}
    </MainCard>
  );
}

AuthCard.propTypes = { children: PropTypes.any, other: PropTypes.any };
