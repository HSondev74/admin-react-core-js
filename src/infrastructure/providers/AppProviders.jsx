import { SWRConfig } from 'swr';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { NotificationProvider } from '../../contexts/NotificationContext';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '../store/store';

const AppProviders = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
    >
      <NotificationProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SWRConfig
              value={{
                revalidateOnFocus: false,
                shouldRetryOnError: false,
                onError: (error, key) => {
                  if (error.status === 401) {
                    // Handle unauthorized errors (e.g., redirect to login)
                    console.error('Unauthorized access:', error);
                  }
                }
              }}
            >
              {children}
            </SWRConfig>
          </PersistGate>
        </Provider>
      </NotificationProvider>
    </SnackbarProvider>
  );
};

export default AppProviders;
