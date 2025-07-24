import { useRef, useState, MouseEvent } from 'react';

// material-ui
import { Theme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';

// assets
import { 
  BellOutlined, 
  CheckCircleOutlined, 
  GiftOutlined, 
  MessageOutlined, 
  SettingOutlined 
} from '@ant-design/icons';

// Type definitions
interface NotificationItem {
  id: number;
  title: string;
  time: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
  isNew?: boolean;
}

// sx styles
const styles: { [key: string]: SxProps<Theme> } = {
  avatar: {
    width: 36,
    height: 36,
    fontSize: '1rem'
  },
  action: {
    mt: '6px',
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
  },
  popper: (theme: Theme) => ({
    boxShadow: theme.customShadows.z1, 
    width: '100%', 
    minWidth: 285, 
    maxWidth: { xs: 285, md: 420 }
  }),
  listItem: (theme: Theme) => ({
    p: 0,
    '& .MuiListItemButton-root': {
      py: 0.5,
      px: 2,
      '&.Mui-selected': { 
        bgcolor: 'grey.50', 
        color: 'text.primary' 
      },
      '& .MuiAvatar-root': {
        width: 36,
        height: 36,
        fontSize: '1rem'
      },
      '& .MuiListItemSecondaryAction-root': {
        mt: '6px',
        ml: 1,
        top: 'auto',
        right: 'auto',
        position: 'relative',
        alignSelf: 'flex-start',
        transform: 'none'
      }
    }
  })
};

// Notification data
const notifications: NotificationItem[] = [
  {
    id: 1,
    title: "It's Cristina danny's birthday today.",
    time: '3:00 AM',
    icon: <GiftOutlined />,
    color: 'success.main',
    bgColor: 'success.lighter',
    description: '2 min ago',
    isNew: true
  },
  {
    id: 2,
    title: 'Aida Burg commented on your post.',
    time: '6:00 AM',
    icon: <MessageOutlined />,
    color: 'primary.main',
    bgColor: 'primary.lighter',
    description: '5 August'
  },
  {
    id: 3,
    title: 'Your Profile is Complete 60%',
    time: '2:45 PM',
    icon: <SettingOutlined />,
    color: 'error.main',
    bgColor: 'error.lighter',
    description: '7 hours ago',
    isNew: true
  },
  {
    id: 4,
    title: 'Cristina Danny invited you to join Meeting.',
    time: '9:10 PM',
    icon: 'C',
    color: 'primary.main',
    bgColor: 'primary.lighter',
    description: 'Daily scrum meeting time'
  }
];

/**
 * Notification component
 * Displays a notification bell with a dropdown of recent notifications
 */
const Notification = (): JSX.Element => {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [unreadCount, setUnreadCount] = useState<number>(
    notifications.filter(item => item.isNew).length
  );
  const [open, setOpen] = useState<boolean>(false);

  const handleToggle = (): void => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent<HTMLDivElement> | Event): void => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  };

  const markAllAsRead = (): void => {
    setUnreadCount(0);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={{
          color: 'text.primary',
          bgcolor: open ? 'grey.100' : 'transparent',
          ...theme.applyStyles('dark', { 
            bgcolor: open ? 'background.default' : 'transparent' 
          })
        }}
        aria-label="show notifications"
        ref={anchorRef}
        aria-controls={open ? 'notification-menu' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={unreadCount} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>
      
      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ 
          modifiers: [{ 
            name: 'offset', 
            options: { 
              offset: [downMD ? -5 : 0, 9] 
            } 
          }] 
        }}
      >
        {({ TransitionProps }) => (
          <Transitions 
            type="grow" 
            position={downMD ? 'top' : 'top-right'} 
            in={open} 
            {...TransitionProps}
          >
            <Paper sx={styles.popper(theme)}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notification"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    unreadCount > 0 && (
                      <Tooltip title="Mark all as read">
                        <IconButton 
                          color="success" 
                          size="small" 
                          onClick={markAllAsRead}
                        >
                          <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                >
                  <List component="nav" sx={styles.listItem(theme)}>
                    {notifications.map((notification) => (
                      <ListItem
                        key={notification.id}
                        component={ListItemButton}
                        divider
                        selected={notification.isNew && unreadCount > 0}
                        secondaryAction={
                          <Typography variant="caption" noWrap>
                            {notification.time}
                          </Typography>
                        }
                      >
                        <ListItemAvatar>
                          {typeof notification.icon === 'string' ? (
                            <Avatar 
                              sx={{ 
                                color: notification.color, 
                                bgcolor: notification.bgColor 
                              }}
                            >
                              {notification.icon}
                            </Avatar>
                          ) : (
                            <Avatar 
                              sx={{ 
                                color: notification.color, 
                                bgcolor: notification.bgColor 
                              }}
                            >
                              {notification.icon}
                            </Avatar>
                          )}
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="h6" component="span">
                              {notification.title}
                            </Typography>
                          }
                          secondary={notification.description}
                        />
                      </ListItem>
                    ))}
                    <ListItemButton sx={{ textAlign: 'center', py: `${12}px !important` }}>
                      <ListItemText
                        primary={
                          <Typography variant="h6" color="primary">
                            View All
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Notification;
