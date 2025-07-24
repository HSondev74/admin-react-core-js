import { styled } from '@mui/material/styles';
import AppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Theme } from '@mui/material/styles';

// project imports
import { DRAWER_WIDTH } from 'config';

interface AppBarStyledProps extends MuiAppBarProps {
  open?: boolean;
}

/**
 * Styled AppBar component with responsive width based on drawer state
 */
const AppBarStyled = styled(AppBar, { 
  shouldForwardProp: (prop) => prop !== 'open' 
})<AppBarStyledProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open
    ? {
        marginLeft: DRAWER_WIDTH,
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }
    : {
        width: `calc(100% - ${theme.spacing(7.5)})`,
        [theme.breakpoints.up('sm')]: {
          width: `calc(100% - ${theme.spacing(9)})`,
        },
      }),
}));

export default AppBarStyled;
