// project imports
import { useEffect } from 'react';
import AppRoutes from 'routes';
import ThemeCustomization from 'themes';
import AppProviders from './infrastructure/providers/AppProviders';
import ScrollTop from './presentation/components/ScrollTop';
import { useAuth } from './infrastructure/hooks/useAuth';

// Component to handle auth initialization
const AuthInitializer = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Add any global auth-related side effects here
  useEffect(() => {
    // You can add any global auth checks or initializations here
  }, [isAuthenticated, user]);

  if (loading && !user) {
    // Show loading indicator while checking auth state
    return <div>Loading...</div>;
  }

  return children;
};

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

function AppContent() {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <AppRoutes />
      </ScrollTop>
    </ThemeCustomization>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AuthInitializer>
        <AppContent />
      </AuthInitializer>
    </AppProviders>
  );
}
