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
        <Box
          key={item.menuId || index}
          ref={(el) => (anchorRefs.current[index] = el)}
          onMouseEnter={() => setHoveredChild(index)}
          sx={{ position: 'relative' }}
        >
          <NavItem item={item} level={level} isParents={true} setSelectedID={setSelectedID} />
          {item.children && hoveredChild === index && anchorRefs.current[index] && (
            <Popper
              open={hoveredChild === index}
              anchorEl={anchorRefs.current[index]}
              placement="right-start"
              transition
              style={{ zIndex: 2100 }}
              onMouseEnter={() => setHoveredChild(index)} // giữ mở khi hover vào popper
              onMouseLeave={() => setHoveredChild(null)} // đóng khi rời ra hoàn toàn
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps} style={{ transformOrigin: 'top left' }} timeout={500}>
                  <Box
                    sx={{
                      backgroundColor: 'white',
                      boxShadow: 2,
                      borderRadius: 1,
                      minWidth: '180px',
                      ml: 2
                    }}
                  >
                    <NavSubMenu items={item.children} level={level + 1} setSelectedID={setSelectedID} />
                  </Box>
                </Grow>
              )}
            </Popper>
          )}
        </Box>
      ))}
    </Box>
  );
}
