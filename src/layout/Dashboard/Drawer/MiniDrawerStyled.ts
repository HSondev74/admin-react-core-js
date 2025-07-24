import { Theme, styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';

// project imports
import { DRAWER_WIDTH } from 'config';

// Type definitions
interface MiniDrawerStyledProps {
  open?: boolean;
  theme?: Theme;
}

// Opened drawer styles
const openedMixin = (theme: Theme) => ({
  width: DRAWER_WIDTH,
  borderRight: '1px solid',
  borderRightColor: theme.palette.divider,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  boxShadow: 'none',
  ...theme.applyStyles('dark', { boxShadow: theme.customShadows.z1 }),
});

// Closed drawer styles
const closedMixin = (theme: Theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: theme.spacing(7.5),
  borderRight: 'none',
  ...theme.applyStyles('dark', { boxShadow: theme.customShadows.z1 }),
});

// ==============================|| DRAWER - MINI STYLED ||============================== //

const MiniDrawerStyled = styled(MuiDrawer, { 
  shouldForwardProp: (prop) => prop !== 'open' 
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default MiniDrawerStyled;
