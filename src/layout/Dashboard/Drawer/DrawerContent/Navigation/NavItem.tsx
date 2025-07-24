import { ReactNode } from 'react';
import { Link, useLocation, matchPath, To } from 'react-router-dom';

// material-ui
import { Theme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import IconButton from 'components/@extended/IconButton';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// Type definitions
import { MenuItem } from 'menu-items/types';

interface NavItemProps {
  item: MenuItem;
  level: number;
  isParents?: boolean;
  setSelectedID?: (id: string) => void;
  children?: ReactNode;
}

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

const NavItem = ({ item, level, isParents = false, setSelectedID }: NavItemProps): JSX.Element => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened ?? false;
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const itemTarget = item.target ? '_blank' : '_self';
  const isSelected = item.url ? !!matchPath({ path: item.url, end: false }, pathname) : false;

  // Handle item click
  const handleClick = () => {
    if (downLG) {
      handlerDrawerOpen(false);
    }
    setSelectedID?.(item.id);
  };

  // Icon component with optional color and size
  const Icon = item.icon;
  const itemIcon = item.icon ? (
    <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} />
  ) : null;

  // Text color based on selection and parent state
  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  // List item content
  const listItemProps = {
    component: item.url ? Link : 'div',
    to: item.url as To,
    target: itemTarget,
    onClick: handleClick,
    sx: {
      zIndex: 1201,
      pl: drawerOpen ? `${level * 28}px` : 1.5,
      py: !drawerOpen && level === 1 ? 1.25 : 1,
      ...(drawerOpen && {
        '&:hover': {
          bgcolor: 'primary.lighter',
        },
        '&.Mui-selected': {
          bgcolor: 'primary.lighter',
          borderRight: `2px solid ${theme.palette.primary.main}`,
          color: iconSelectedColor,
          '&:hover': {
            color: iconSelectedColor,
            bgcolor: 'primary.lighter',
          },
        },
      }),
      ...(!drawerOpen && {
        '&:hover': {
          bgcolor: 'transparent',
        },
        '&.Mui-selected': {
          '& .MuiListItemIcon-root': {
            color: iconSelectedColor,
          },
        },
      }),
    },
  };

  return (
    <ListItemButton
      {...listItemProps}
      selected={isSelected}
      sx={{
        ...(isParents && {
          color: theme.palette.primary.main,
          fontWeight: 500,
        }),
      }}
    >
      {itemIcon && (
        <ListItemIcon
          sx={{
            minWidth: 28,
            color: isSelected ? iconSelectedColor : textColor,
            ...(!drawerOpen && {
              borderRadius: 1.5,
              width: 36,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                bgcolor: 'secondary.lighter',
              },
            }),
            ...(!drawerOpen &&
              isSelected && {
                bgcolor: 'primary.lighter',
                '&:hover': {
                  bgcolor: 'primary.lighter',
                },
              }),
          }}
        >
          {itemIcon}
        </ListItemIcon>
      )}
      
      {(drawerOpen || (!drawerOpen && level !== 1)) && (
        <ListItemText
          primary={
            <Typography variant="h6" sx={{ color: isSelected ? 'primary.main' : textColor }}>
              {item.title}
            </Typography>
          }
        />
      )}
      
      {drawerOpen && item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

export default NavItem;
