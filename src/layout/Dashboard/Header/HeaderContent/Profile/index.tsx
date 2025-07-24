import { useRef, useState, ReactNode, SyntheticEvent } from 'react';
import { useTheme } from '@mui/material/styles';
import { SxProps } from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import IconButton from 'components/@extended/IconButton';

// assets
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import avatar1 from 'assets/images/users/avatar-1.png';

// Type definitions
interface TabPanelProps {
  children?: ReactNode;
  value: number;
  index: number;
  sx?: SxProps;
}

// Tab panel wrapper
const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div 
      role="tabpanel" 
      hidden={value !== index} 
      id={`profile-tabpanel-${index}`} 
      aria-labelledby={`profile-tab-${index}`} 
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => ({
  id: `profile-tab-${index}`,
  'aria-controls': `profile-tabpanel-${index}`,
});

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = (): JSX.Element => {
  const theme = useTheme();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<number>(0);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent<HTMLElement> | Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  };

  const handleLogout = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    // Handle logout logic here
    console.log('Logout clicked');
  };

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Styles
  const styles: { [key: string]: SxProps } = {
    profileButton: {
      p: 0.25,
      bgcolor: 'transparent',
      '&:hover': {
        bgcolor: 'primary.lighter',
      },
      ...(open && {
        bgcolor: 'primary.lighter',
        '&:hover': {
          bgcolor: 'primary.lighter',
        },
      }),
    },
    paper: {
      boxShadow: theme.customShadows.z1,
      width: 290,
      minWidth: 240,
      maxWidth: 290,
      [theme.breakpoints.down('md')]: {
        maxWidth: 250,
      },
    },
    tabs: {
      '& .MuiTabs-flexContainer': {
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
      '& .MuiTab-root': {
        minWidth: '50%',
        py: 1,
        '&.Mui-selected': {
          color: theme.palette.primary.main,
        },
      },
      '& .MuiTabs-indicator': {
        height: 2,
        bgcolor: theme.palette.primary.main,
      },
    },
    cardContent: {
      p: 2,
    },
    userInfo: {
      p: 2,
      borderBottom: `1px solid ${theme.palette.divider}`,
      textAlign: 'center',
    },
    userName: {
      mt: 1,
      fontWeight: 500,
      color: theme.palette.text.primary,
    },
    userRole: {
      color: theme.palette.text.secondary,
      fontSize: '0.75rem',
    },
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Tooltip title="Account settings">
        <ButtonBase
          sx={styles.profileButton}
          aria-label="open profile"
          ref={anchorRef}
          aria-controls={open ? 'profile-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <Avatar 
            alt="profile user" 
            src={avatar1} 
            sx={{ width: 32, height: 32 }} 
          />
        </ButtonBase>
      </Tooltip>
      
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper sx={styles.paper}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  <Box sx={styles.userInfo}>
                    <Avatar 
                      alt="profile user" 
                      src={avatar1} 
                      sx={{ width: 56, height: 56, m: '0 auto' }} 
                    />
                    <Typography variant="h5" sx={styles.userName}>
                      John Doe
                    </Typography>
                    <Typography variant="body2" sx={styles.userRole}>
                      Admin
                    </Typography>
                  </Box>
                  
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                      value={value} 
                      onChange={handleTabChange} 
                      aria-label="profile tabs"
                      variant="fullWidth"
                      sx={styles.tabs}
                    >
                      <Tab icon={<UserOutlined />} label="Profile" {...a11yProps(0)} />
                      <Tab icon={<SettingOutlined />} label="Settings" {...a11yProps(1)} />
                    </Tabs>
                  </Box>
                  
                  <TabPanel value={value} index={0}>
                    <CardContent sx={styles.cardContent}>
                      <ProfileTab handleLogout={handleLogout} />
                    </CardContent>
                  </TabPanel>
                  
                  <TabPanel value={value} index={1}>
                    <CardContent sx={styles.cardContent}>
                      <SettingTab />
                    </CardContent>
                  </TabPanel>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
