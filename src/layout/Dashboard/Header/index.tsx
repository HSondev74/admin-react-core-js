import { useMemo } from 'react';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

// project imports
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';
import IconButton from 'components/@extended/IconButton';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from 'config';

// assets
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

/**
 * Header component for the dashboard layout
 * Contains the app bar with navigation controls and header content
 */
const Header = (): JSX.Element => {
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened ?? false;

  // Memoize header content to prevent unnecessary re-renders
  const headerContent = useMemo(() => <HeaderContent />, []);

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    handlerDrawerOpen(!drawerOpen);
  };

  // Icon to show based on drawer state
  const Icon = drawerOpen ? MenuFoldOutlined : MenuUnfoldOutlined;

  return (
    <AppBar
      enableColorOnDark
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: 'background.default',
        transition: (theme) =>
          drawerOpen
            ? theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              })
            : 'none',
      }}
    >
      <Toolbar>
        <IconButton
          color="secondary"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{
            color: 'text.primary',
            bgcolor: 'grey.100',
            ml: { xs: 0, lg: -2 },
            p: 1,
            ...(drawerOpen && { display: 'none' }),
          }}
        >
          <Icon style={{ fontSize: '1.5rem' }} />
        </IconButton>
        {headerContent}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
