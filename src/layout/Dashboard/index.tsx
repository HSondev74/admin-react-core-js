import { JSX, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { Theme } from '@mui/material/styles';

// project imports
import Drawer from '@/layout/Dashboard/Drawer';
import Header from '@/layout/Dashboard/Header';
import Footer from '@/layout/Dashboard/Footer';
import Loader from '@/components/Loader';
import Breadcrumbs from '@/components/@extended/Breadcrumbs';

import { handlerDrawerOpen, useGetMenuMaster } from '@/api/menu';

// ==============================|| MAIN LAYOUT ||============================== //

const DashboardLayout = (): JSX.Element => {
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme: Theme) => theme.breakpoints.down('xl'));

  // Set media wise responsive drawer
  useEffect(() => {
    handlerDrawerOpen(!downXL);
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      <Drawer />
      <Box
        component="main"
        sx={{
          width: '100%',
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          transition: (theme) =>
            theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          ...(!downXL && {
            ml: 0,
            width: 'calc(100% - 260px)',
            flex: '1 1 calc(100% - 260px)',
          }),
        }}
      >
        <Toolbar sx={{ mb: 2 }} />
        <Breadcrumbs navigation={[]} title titleBottom card={false} divider={false} />
        <Outlet />
        <Footer />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
