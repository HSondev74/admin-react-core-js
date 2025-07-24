// project imports
import NavCard from '@/layout/Dashboard/Drawer/DrawerContent/NavCard';
import Navigation from '@/layout/Dashboard/Drawer/DrawerContent/Navigation';
import SimpleBar from '@/components/third-party/SimpleBar';
import { useGetMenuMaster } from '@/api/menu';
import { JSX } from 'react';

// ==============================|| DRAWER CONTENT ||============================== //

/**
 * DrawerContent component
 * Renders the main content of the drawer including navigation and optional NavCard
 */
const DrawerContent = (): JSX.Element => {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened ?? false;

  return (
    <SimpleBar 
      sx={{ 
        '& .simplebar-content': { 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        },
        height: '100%',
      }}
    >
      <Navigation />
      {drawerOpen && <NavCard />}
    </SimpleBar>
  );
};

export default DrawerContent;
