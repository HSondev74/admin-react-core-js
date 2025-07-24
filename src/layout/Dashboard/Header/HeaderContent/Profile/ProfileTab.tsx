import { FC, MouseEvent } from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';

// assets
import { 
  EditOutlined, 
  ProfileOutlined, 
  LogoutOutlined, 
  UserOutlined, 
  WalletOutlined 
} from '@ant-design/icons';

// Type definitions
interface ProfileTabProps {
  handleLogout: (event: MouseEvent<HTMLElement>) => void;
}

// Styles
const styles: { [key: string]: SxProps<Theme> } = {
  list: {
    p: 0, 
    '& .MuiListItemIcon-root': { 
      minWidth: 32,
      color: 'text.primary',
      '& .anticon': {
        fontSize: '1rem'
      }
    },
    '& .MuiListItemButton-root': {
      py: 0.75,
      '&:hover': {
        backgroundColor: 'primary.lighter',
        '& .MuiListItemIcon-root': {
          color: 'primary.main',
        },
      },
    },
  },
  listItemText: {
    '& .MuiTypography-root': {
      fontSize: '0.875rem',
    },
  },
};

/**
 * ProfileTab component
 * Displays a list of profile-related actions in a dropdown menu
 */
const ProfileTab: FC<ProfileTabProps> = ({ handleLogout }) => {
  const navigate = useNavigate();

  const handleItemClick = (path: string) => (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    navigate(path);
  };

  return (
    <List component="nav" sx={styles.list}>
      <ListItemButton onClick={handleItemClick('/apps/profiles/user/profile')}>
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="Edit Profile" sx={styles.listItemText} />
      </ListItemButton>
      
      <ListItemButton onClick={handleItemClick('/apps/profiles/account/basic')}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="View Profile" sx={styles.listItemText} />
      </ListItemButton>
      
      <ListItemButton onClick={handleItemClick('/apps/invoice/basic')}>
        <ListItemIcon>
          <ProfileOutlined />
        </ListItemIcon>
        <ListItemText primary="Social Profile" sx={styles.listItemText} />
      </ListItemButton>
      
      <ListItemButton onClick={handleItemClick('/apps/e-commerce/checkout')}>
        <ListItemIcon>
          <WalletOutlined />
        </ListItemIcon>
        <ListItemText primary="Billing" sx={styles.listItemText} />
      </ListItemButton>
      
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" sx={styles.listItemText} />
      </ListItemButton>
    </List>
  );
};

export default ProfileTab;
