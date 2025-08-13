import { Box, Typography, Chip, Tooltip } from '@mui/material';
import { MoreOutlined } from '@ant-design/icons';

export const getMenuColumns = (availableRoles) => [
  {
    id: 'name',
    label: 'Menu Name',
    minWidth: 200,
    render: (value, row) => {
      const item = row.item;
      const hasChildren = row.children && row.children.length > 0;
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', pl: row.level * 2 }}>
          {row.level > 0 && <Box sx={{ mr: 1, color: 'text.secondary' }}>└─</Box>}
          <Typography
            variant="body1"
            sx={{
              fontWeight: row.level === 0 ? 'bold' : 'normal',
              color: row.level === 0 ? 'primary.main' : 'text.primary'
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
    label: 'Path',
    minWidth: 150,
    render: (value, row) => (
      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
        {row.item.path || row.item.url}
      </Typography>
    )
  },
  {
    id: 'sortOrder',
    label: 'Order',
    minWidth: 80,
    render: (value, row) => row.item.sortOrder || 0
  },
  {
    id: 'type',
    label: 'Menu Type',
    minWidth: 100,
    render: (value, row) => {
      const menuType = row.item.menuType || 'Unknown';
      return (
        <Chip 
          label={menuType} 
          size="small" 
          color={menuType === 'Parent' ? 'primary' : menuType === 'Child' ? 'secondary' : 'default'} 
        />
      );
    }
  },
  {
    id: 'roles',
    label: 'Roles',
    minWidth: 220,
    render: (value, row) => {
      const menuRoles = row.item.roles || [];
      const maxVisible = 2;

      if (menuRoles.length === 0) {
        return (
          <Typography variant="body2" sx={{ color: 'text.disabled', fontSize: '0.8rem' }}>
            Chưa gán quyền
          </Typography>
        );
      }

      const visibleRoles = menuRoles.slice(0, maxVisible);
      const hiddenRoles = menuRoles.slice(maxVisible);
      const allRoleNames = menuRoles
        .map((roleId) => {
          const role = availableRoles.find((r) => r.id === roleId);
          return role?.name || 'Unknown';
        })
        .join(', ');

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, maxWidth: 200 }}>
          {visibleRoles.map((roleId) => {
            const role = availableRoles.find((r) => r.id === roleId);
            return role ? (
              <Chip
                key={roleId}
                label={role.name}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  maxWidth: '80px',
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
              />
            ) : null;
          })}

          {hiddenRoles.length > 0 && (
            <Tooltip
              title={
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Tất cả quyền:
                  </Typography>
                  <Typography variant="body2">{allRoleNames}</Typography>
                </Box>
              }
              arrow
              placement="top"
            >
              <Chip
                icon={<MoreOutlined style={{ fontSize: '12px' }} />}
                label={`+${hiddenRoles.length}`}
                size="small"
                color="primary"
                variant="filled"
                sx={{
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }}
              />
            </Tooltip>
          )}
        </Box>
      );
    }
  }
];