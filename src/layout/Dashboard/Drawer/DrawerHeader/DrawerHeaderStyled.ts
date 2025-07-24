import { Theme, styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

// Type definitions
interface DrawerHeaderStyledProps extends BoxProps {
  open?: boolean;
  theme?: Theme;
}

// ==============================|| DRAWER HEADER - STYLED ||============================== //

const DrawerHeaderStyled = styled(Box, { 
  shouldForwardProp: (prop) => prop !== 'open' 
})<DrawerHeaderStyledProps>(({ theme, open }) => ({
  ...theme.mixins.toolbar,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: theme.spacing(0),
  ...(open && {
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(3),
  }),
  transition: theme.transitions.create(['padding', 'justify-content'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export default DrawerHeaderStyled;
