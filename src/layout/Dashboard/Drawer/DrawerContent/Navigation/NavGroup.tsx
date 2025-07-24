// material-ui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavItem from '@/layout/Dashboard/Drawer/DrawerContent/Navigation/NavItem';
import { useGetMenuMaster } from '@/api/menu';

// Type definitions
import { MenuItem } from '@/menu-items';

interface NavGroupProps {
  item: MenuItem;
}

/**
 * NavGroup component
 * Renders a group of navigation items
 */
const NavGroup = ({ item }: NavGroupProps): JSX.Element => {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened ?? false;

  // Render navigation items based on their type
  const navCollapse = item.children?.map((menuItem: MenuItem) => {
    switch (menuItem.type) {
      case 'collapse':
        return (
          <Typography 
            key={menuItem.id} 
            variant="caption" 
            color="error" 
            sx={{ 
              p: 2.5,
              display: 'block',
              textAlign: 'center'
            }}
          >
            collapse - only available in paid version
          </Typography>
        );
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
      default:
        return (
          <Typography 
            key={menuItem.id} 
            variant="h6" 
            color="error" 
            align="center"
            sx={{ p: 1 }}
          >
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
            {/* Only available in paid version */}
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
};

export default NavGroup;
