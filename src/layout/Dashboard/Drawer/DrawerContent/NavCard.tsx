// material-ui
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/material/styles';

// project import
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import avatar from 'assets/images/users/avatar-group.png';

// Styles
const cardStyles: { [key: string]: SxProps } = {
  card: {
    bgcolor: 'grey.50',
    m: 3,
    textAlign: 'center',
    '&:hover': {
      transform: 'scale(1.02)',
      transition: 'transform 0.3s ease-in-out',
    },
  },
  media: {
    width: 112,
    height: 'auto',
    mx: 'auto',
    mb: 1.5,
  },
  button: {
    mt: 1,
    fontWeight: 600,
  },
};

// ==============================|| DRAWER CONTENT - NAVIGATION CARD ||============================== //

/**
 * NavCard component
 * Displays a promotional card in the navigation drawer
 */
const NavCard = (): JSX.Element => {
  return (
    <MainCard sx={cardStyles.card} elevation={0}>
      <Stack alignItems="center" spacing={2.5}>
        <CardMedia 
          component="img" 
          src={avatar} 
          alt="Mantis Pro" 
          sx={cardStyles.media} 
        />
        <Stack alignItems="center">
          <Typography variant="h5" component="div" gutterBottom>
            Mantis Pro
          </Typography>
          <Typography variant="subtitle1" color="secondary" sx={{ mb: 1.5 }}>
            Checkout pro features
          </Typography>
        </Stack>
        <AnimateButton>
          <Button 
            component={Link} 
            target="_blank" 
            rel="noopener noreferrer"
            href="https://mantisdashboard.io" 
            variant="contained" 
            color="primary" 
            size="small"
            sx={cardStyles.button}
          >
            Pro Version
          </Button>
        </AnimateButton>
      </Stack>
    </MainCard>
  );
};

export default NavCard;
