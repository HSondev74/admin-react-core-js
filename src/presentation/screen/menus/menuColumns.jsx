import { Box, Typography, IconButton } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

export const getMenuColumns = (expandedItems, onToggleExpand, onSortOrder, flatMenus = []) => [
  {
    id: 'name',
    label: 'Tên danh sách',
    minWidth: 150,
    align: 'left',
    padding: 3.5,
    render: (value, row) => {
      const item = row.item;
      const hasChildren = row.children && row.children.length > 0;
      const isExpanded = expandedItems.includes(item.id);
      const indentLevel = row.level || 0;

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', pl: indentLevel * 2 }}>
          {hasChildren ? (
            <IconButton
              size="small"
              onClick={() => onToggleExpand(item.id)}
              sx={{
                mr: 1,
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }}
              disableRipple
            >
              {isExpanded ? <DownOutlined style={{ fontSize: '15px' }} /> : <RightOutlined style={{ fontSize: '15px' }} />}
            </IconButton>
          ) : (
            <Box sx={{ width: 24, mr: 1 }} />
          )}
          <Typography
            variant="body1"
            sx={{
              fontWeight: indentLevel === 0 ? 'bold' : 'normal',
              color: indentLevel === 0 ? 'primary.main' : 'text.primary'
            }}
          >
            {item.name}
            {hasChildren && (
              <Box component="span" sx={{ ml: 1, fontSize: '0.8rem', color: 'text.secondary' }}>
                ({row.children.length})
              </Box>
            )}
          </Typography>
        </Box>
      );
    }
  },
  {
    id: 'path',
    label: 'Đường dẫn',
    minWidth: 100,
    align: 'left',
    render: (value, row) => (
      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
        {row.item.path || row.item.url}
      </Typography>
    )
  },
  {
    id: 'type',
    label: 'Loại',
    minWidth: 100,
    align: 'center',
    render: (vaue, row) => {
      const menuType = row.item.menuType || 'Unknown';
      return (
        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
          {menuType === 'MENU' ? 'Danh sách' : 'Nút'}
        </Typography>
      );
    }
  },
  {
    id: 'sortOrder',
    label: 'Sắp xếp',
    minWidth: 80,
    align: 'center',
    render: (value, row) => {
      const currentIndex = flatMenus.findIndex(menu => menu.item?.id === row.item?.id);
      const isFirst = currentIndex === 0;
      const isLast = currentIndex === flatMenus.length - 1;
      
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          {!isFirst && (
            <IconButton 
              size="small" 
              sx={{ p: 0.25 }}
              onClick={() => onSortOrder && onSortOrder(row, 'UP')}
              disabled={!onSortOrder}
            >
              <ArrowUpward sx={{ fontSize: 16 }} />
            </IconButton>
          )}
          {!isLast && (
            <IconButton 
              size="small" 
              sx={{ p: 0.25 }}
              onClick={() => onSortOrder && onSortOrder(row, 'DOWN')}
              disabled={!onSortOrder}
            >
              <ArrowDownward sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>
      );
    }
  }
];
