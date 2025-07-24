import { SxProps } from '@mui/material/styles';

// project imports
import DrawerHeaderStyled from './DrawerHeaderStyled';
import Logo from 'components/logo';

// Type definitions
interface DrawerHeaderProps {
  open: boolean;
  sx?: SxProps;
}

// Styles
const headerStyles: { [key: string]: SxProps } = {
  root: {
    minHeight: '60px',
    width: 'initial',
    paddingTop: '8px',
    paddingBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: (open: boolean) => ({
    width: open ? 'auto' : 35,
    height: 35,
    transition: 'width 0.3s ease-in-out',
  }),
};

// ==============================|| DRAWER HEADER ||============================== //

/**
 * DrawerHeader component
 * Displays the logo in the drawer header with responsive sizing
 */
const DrawerHeader = ({ open, sx }: DrawerHeaderProps): JSX.Element => {
  return (
    <DrawerHeaderStyled
      open={open}
      sx={{
        ...headerStyles.root,
        paddingLeft: open ? '24px' : 0,
        ...sx,
      }}
    >
      <Logo 
        isIcon={!open} 
        sx={headerStyles.logo(open)} 
      />
    </DrawerHeaderStyled>
  );
};

export default DrawerHeader;
