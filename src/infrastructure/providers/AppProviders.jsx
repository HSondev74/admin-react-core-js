import { SWRConfig } from 'swr';
import { Provider } from 'react-redux';
import { store } from '../store/store';

const AppProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          shouldRetryOnError: false,
          onError: (error, key) => {
            if (error.status === 401) {
              // Handle unauthorized errors (e.g., redirect to login)
              console.error('Unauthorized access:', error);
            }
          },
        }}
      >
        {children}
      </SWRConfig>
    </Provider>
  );
};

export default AppProviders;
