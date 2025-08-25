// project imports
import Navigation from './Navigation';
import SimpleBar from '../../../../third-party/SimpleBar';
import { useGetMenuMaster } from '../../../../../../infrastructure/utils/menu';

// ==============================|| DRAWER CONTENT ||============================== //

export default function DrawerContent() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  return (
    <>
      <SimpleBar sx={{ '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
        <Navigation />
        {/* {drawerOpen && <NavCard />} */}
      </SimpleBar>
    </>
  );
}
