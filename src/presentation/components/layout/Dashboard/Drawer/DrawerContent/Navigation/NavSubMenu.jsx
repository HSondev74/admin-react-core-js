import { Box } from '@mui/material';
import NavItem from './NavItem';

export default function NavSubMenu({ items, level, setSelectedID }) {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        boxShadow: 2,
        zIndex: 2001,
        borderRadius: 1,
        minWidth: '180px',
        ml: 1
      }}
    >
      {items.map((item, index) => (
        <Box key={item.menuId || index}>
          <NavItem item={item} level={level} isParents={true} setSelectedID={setSelectedID} />
        </Box>
      ))}
    </Box>
  );
}
