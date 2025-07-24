import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SxProps, Theme } from '@mui/material/styles';
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import { 
  CommentOutlined, 
  LockOutlined, 
  QuestionCircleOutlined, 
  UserOutlined, 
  UnorderedListOutlined 
} from '@ant-design/icons';

// Type definitions
interface SettingTabProps {
  handleLogout?: () => void;
}

// Interface for navigation items
interface NavItem {
  index: number;
  icon: JSX.Element;
  text: string;
  route: string;
  external?: boolean;
}

// Navigation items configuration
const navItems: NavItem[] = [
  {
    index: 0,
    icon: <UserOutlined />,
    text: 'Social Profile',
    route: '/apps/profiles/social/posts'
  },
  {
    index: 1,
    icon: <CommentOutlined />,
    text: 'Site Feedback',
    route: '/apps/forms/validation',
    external: true
  },
  {
    index: 2,
    icon: <QuestionCircleOutlined />,
    text: 'FAQ',
    route: '/pages/faq',
    external: true
  },
  {
    index: 3,
    icon: <LockOutlined />,
    text: 'Privacy',
    route: '/pages/privacy-policy',
    external: true
  },
  {
    index: 4,
    icon: <UnorderedListOutlined />,
    text: 'Terms & Conditions',
    route: '/pages/terms-conditions',
    external: true
  }
];

// Styles
const styles: { [key: string]: SxProps<Theme> } = {
  list: {
    p: 0,
    '& .MuiListItemButton-root': {
      py: 0.75,
      px: 2,
      '&:hover': {
        bgcolor: 'primary.lighter',
        '& .MuiListItemIcon-root': {
          color: 'primary.main',
        },
      },
      '&.Mui-selected': {
        bgcolor: 'primary.lighter',
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: 'primary.main',
        },
        '&:hover': {
          bgcolor: 'primary.lighter',
        },
      },
    },
    '& .MuiListItemIcon-root': {
      minWidth: 32,
      color: 'text.primary',
      '& .anticon': {
        fontSize: '1rem',
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
 * SettingTab component
 * Displays a list of setting-related navigation options in a dropdown menu
 */
const SettingTab: React.FC<SettingTabProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Update selected index based on current route
  useEffect(() => {
    const currentIndex = navItems.findIndex((item) => item.route === location.pathname);
    if (currentIndex > -1) {
      setSelectedIndex(currentIndex);
    }
  }, [location]);

  const handleListItemClick = (event: React.MouseEvent<HTMLElement>, index: number, route: string, external = false) => {
    setSelectedIndex(index);
    
    if (external) {
      event.preventDefault();
      window.open(route, '_blank');
    } else if (route) {
      navigate(route);
    }
  };

  return (
    <List component="nav" sx={styles.list}>
      {navItems.map((item) => {
        const { index, icon, text, route, external } = item;
        
        const listItem = (
          <ListItemButton
            key={index}
            selected={selectedIndex === index}
            onClick={(event) => handleListItemClick(event, index, route, external)}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} sx={styles.listItemText} />
          </ListItemButton>
        );

        return external ? (
          <Link
            key={index}
            href={route}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            color="text.primary"
          >
            {listItem}
          </Link>
        ) : (
          listItem
        );
      })}
    </List>
  );
};

export default SettingTab;
