import { Box, Typography, IconButton } from '@mui/material';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

export const getDepartmentColumns = (expandedItems, onToggleExpand) => [
  {
    id: 'name',
    label: 'Tên phòng ban',
    minWidth: 180,
    align: 'left',
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
          <Typography variant="body1">
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
    id: 'code',
    label: 'Mã phòng ban',
    minWidth: 150,
    align: 'left',
    render: (value, row) => (
      <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
        {row.item.code}
      </Typography>
    )
  },
  {
    id: 'status',
    label: 'Trạng thái',
    minWidth: 120,
    align: 'left',
    render: (value, row) => (
      <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
        {row.item.lockFlag === '0' ? 'Hoạt động' : 'Khóa'}
      </Typography>
    )
  }
];
