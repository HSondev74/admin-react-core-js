import React, { useState, useRef } from 'react';
import { Box, Popper } from '@mui/material';
import NavItem from './NavItem';
import Grow from '@mui/material/Grow';

export default function NavSubMenu({ items, level = 1, setSelectedID }) {
  const [hoveredChild, setHoveredChild] = useState(null);
  const anchorRefs = useRef([]);
  anchorRefs.current = []; // Reset ref mỗi lần render

  const handleMenuLeave = () => setHoveredChild(null);

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
      onMouseLeave={handleMenuLeave}
    >
      {items.map((item, index) => (
        <Box key={item.menuId || index} ref={(el) => (anchorRefs.current[index] = el)} sx={{ position: 'relative' }}>
          <NavItem item={item} level={level} isParents={true} setSelectedID={setSelectedID} />
        </Box>
      ))}
    </Box>
  );
}
