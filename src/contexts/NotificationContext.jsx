import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { alpha, useTheme } from '@mui/material/styles';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info' // 'error', 'warning', 'info', 'success'
  });

  const theme = useTheme();

  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const hideNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        hideNotification
      }}
    >
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ width: '100%', maxWidth: 400, '& .MuiPaper-root': { width: '100%' } }}
      >
        <Alert
          onClose={hideNotification}
          severity={notification.severity}
          variant="standard"
          sx={{
            width: '100%',
            fontSize: '1.1rem',
            '& .MuiAlert-icon': { fontSize: '1.5rem' },
            py: 1.5,
            backdropFilter: 'blur(10px)',
            backgroundColor: alpha(theme.palette[notification.severity].main, 0.15),
            border: '1px solid',
            borderColor: alpha(theme.palette[notification.severity].main, 0.3),
            color: theme.palette[notification.severity].main,
            boxShadow: theme.shadows[1]
          }}
        >
          {typeof notification.message === 'string' ? notification.message : notification.message.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
