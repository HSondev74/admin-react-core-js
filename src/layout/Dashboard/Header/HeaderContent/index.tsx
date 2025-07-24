import { FC } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';

// project imports
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

// assets
import { GithubOutlined } from '@ant-design/icons';

// ==============================|| HEADER - CONTENT ||============================== //

/**
 * HeaderContent component
 * Renders the content of the header including search, notifications, and user profile
 */
const HeaderContent: FC = () => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  // Styles
  const styles: { [key: string]: SxProps<Theme> } = {
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexGrow: 1,
      '& > *': {
        marginLeft: 1,
      },
    },
    spacer: {
      width: '100%',
      ml: 1,
    },
    githubButton: {
      color: theme.palette.mode === 'dark' ? 'text.primary' : 'inherit',
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
  };

  return (
    <Box sx={styles.headerContent}>
      {!downLG && <Search />}
      {downLG && <Box sx={styles.spacer} />}
      
      <IconButton
        component={Link}
        href="https://github.com/codedthemes/mantis-free-react-admin-template"
        target="_blank"
        rel="noopener noreferrer"
        disableRipple
        color="secondary"
        title="View on GitHub"
        sx={styles.githubButton}
      >
        <GithubOutlined />
      </IconButton>

      <Notification />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </Box>
  );
};

export default HeaderContent;
