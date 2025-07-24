// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavGroup from '@/layout/Dashboard/Drawer/DrawerContent/Navigation/NavGroup';
import menuItem from '@/menu-items';

// Type definitions
import { MenuItem } from '@/menu-items/types';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

/**
 * Navigation component
 * Renders the navigation menu items from the menu configuration
 */
const Navigation = (): JSX.Element => {
  // Map through menu items and render appropriate components based on type
  const navGroups = menuItem.items.map((item: MenuItem) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography 
            key={item.id} 
            variant="h6" 
            color="error" 
            align="center"
            sx={{ p: 2 }}
          >
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return (
    <Box 
      sx={{ 
        pt: 2,
        '& > *:not(:last-child)': {
          mb: 1,
        },
      }}
    >
      {navGroups}
    </Box>
  );
};

export default Navigation;
