// project imports
import AppRoutes from '@/routes';
import ThemeCustomization from '@/themes';
import ScrollTop from '@/components/ScrollTop';
import { JSX } from 'react';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

const App = (): JSX.Element => {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <AppRoutes />
      </ScrollTop>
    </ThemeCustomization>
  );
};

export default App;
