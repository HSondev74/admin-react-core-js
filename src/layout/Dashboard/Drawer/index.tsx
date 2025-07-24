import { useMemo } from 'react';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';

// project imports
import DrawerHeader from '@/layout/Dashboard/Drawer/DrawerHeader';
import DrawerContent from '@/layout/Dashboard/Drawer/DrawerContent';
import MiniDrawerStyled from '@/layout/Dashboard/Drawer/MiniDrawerStyled';
import { DRAWER_WIDTH } from '@/config';

import { handlerDrawerOpen, useGetMenuMaster } from '@/api/menu';

// Type definitions
interface MainDrawerProps {
  window?: () => Window;
}

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

/**
 * Main drawer component for the dashboard layout
 * Handles responsive behavior and drawer state
 */
const MainDrawer = ({ window }: MainDrawerProps): JSX.Element => {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened ?? false;
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  // Responsive drawer container
  const container = typeof window !== 'undefined' ? () => window.document.body : undefined;

  // Memoize drawer content and header to prevent unnecessary re-renders
  const drawerContent = useMemo(() => <DrawerContent />, []);
  const drawerHeader = useMemo(() => <DrawerHeader open={drawerOpen} />, [drawerOpen]);

  // Drawer content
  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {drawerHeader}
      {drawerContent}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        flexShrink: { lg: 0 },
        width: drawerOpen ? DRAWER_WIDTH : 0,
        transition: (theme) =>
          theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
      }}
      aria-label="mailbox folders"
    >
      {!downLG ? (
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          {drawer}
        </MiniDrawerStyled>
      ) : (
        <Drawer
          container={container}
          variant="temporary"
          open={drawerOpen}
          onClose={() => handlerDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: 'none',
              backgroundImage: 'none',
              boxShadow: 'inherit',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default MainDrawer;
