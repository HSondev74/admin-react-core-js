import { Box, Typography, Divider } from '@mui/material';
import NavItem from './NavItem';

export default function NavSubMenu({ items, level, setSelectedID, parentTitle }) {
  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        color: '#333',
        border: '1px solid #d0d0d0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 2001,
        borderRadius: 1,
        minWidth: '180px',
        ml: 1
      }}
    >
      {/* Hiển thị tiêu đề cha chỉ ở level 2 */}
      {level === 2 && parentTitle && (
        <>
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#666', fontSize: '0.9rem' }}>
              {parentTitle}
            </Typography>
          </Box>
          <Divider />
        </>
      )}

      {items.map((item, index) => (
        <Box key={item.menuId || index}>
          <NavItem item={item} level={level} isParents={true} setSelectedID={setSelectedID} />
        </Box>
      ))}
    </Box>
  );
}
