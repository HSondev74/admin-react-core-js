import { useState, useEffect } from 'react';
import { Box, Typography, Chip, Tooltip } from '@mui/material';
import { MoreOutlined } from '@ant-design/icons';
// Components
import MenuDataTable from './MenuDataTable';
import MainCard from '../../components/MainCard';
// Material UI
import { Button, Stack, TextField, InputAdornment, Collapse, Divider } from '@mui/material';
// Icons
import { PlusOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
// Styles
import { pageStyles, modalWrapperStyles } from '../../assets/styles/pageStyles';
import ModalWrapper from '../../components/CustomTable/ModalWrapper';
import MenuFormAction from './MenuFormAction';
import MenuAdvancedFilter from './MenuAdvancedFilter';
// Api
import menuApi from '../../../infrastructure/api/http/menuApi';

// List menu tree for table display
const listMenus = (menus, level = 0) => {
  const result = [];
  menus.forEach((menu) => {
    result.push({ ...menu, level, id: menu.item?.id });
    if (menu.children && menu.children.length > 0) {
      result.push(...listMenus(menu.children, level + 1));
    }
  });
  return result;
};

export default function MenuManagement() {
  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [childFormOpen, setChildFormOpen] = useState(false);
  const [parentMenuItem, setParentMenuItem] = useState(null);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Function to refresh menu data
  const refreshMenuData = async () => {
    try {
      const response = await menuApi.getAllMenuTree();
      console.log('getAllMenuTree response:', response);
      let menuData = [];
      if (response && Array.isArray(response.data)) {
        menuData = response.data;
      } else if (response && Array.isArray(response)) {
        menuData = response;
      }
      setMenus(menuData);
      setFilteredMenus(menuData);
    } catch (err) {
      console.error('Error refreshing menus:', err);
    }
  };

  // Expose refresh function globally for MenuFormAction
  useEffect(() => {
    window.refreshMenuData = refreshMenuData;
    return () => {
      delete window.refreshMenuData;
    };
  }, []);

  console.log('Menus:', menus);

  // Load menu tree data
  useEffect(() => {
    const loadMenus = async () => {
      try {
        setLoading(true);
        const response = await menuApi.getAllMenuTree();
        console.log('getAllMenuTree response:', response);

        // Get the menu data from the response
        let menuData = [];
        if (response && Array.isArray(response.data)) {
          menuData = response.data;
        } else if (response && Array.isArray(response)) {
          menuData = response;
        } else {
          console.warn('Unexpected response structure:', response);
        }

        setMenus(menuData);
        setFilteredMenus(menuData);
        setError(null);
      } catch (err) {
        console.error('Error loading menus:', err);
        setError(err.message);
        setMenus([]); // Ensure menus is always an array
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, []);

  // Load roles
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await menuApi.getRoles();
        setAvailableRoles(response.data);
      } catch (err) {
        console.error('Error loading roles:', err);
        setAvailableRoles([]);
      }
    };

    loadRoles();
  }, []);

  // Delete menu handler
  const handleDelete = async (ids) => {
    try {
      const id = Array.isArray(ids) ? ids[0] : ids;
      await menuApi.deleteMenuItem(id);

      const deleteRecursive = (menuList) => {
        return menuList.filter((menu) => {
          const item = menu.item;
          const menuId = item.id;
          if (menuId === id) return false;
          if (menu.children) {
            menu.children = deleteRecursive(menu.children);
          }
          return true;
        });
      };

      const updatedMenus = deleteRecursive(menus);
      setMenus(updatedMenus);
      setFilteredMenus(updatedMenus);
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };

  // Add child menu handler
  const handleAddChild = (parentMenu) => {
    console.log('Adding child to:', parentMenu.item.name);
    setParentMenuItem(parentMenu);
    setChildFormOpen(true);
  };

  const handleCloseChildForm = () => {
    setChildFormOpen(false);
    setParentMenuItem(null);
  };

  // Custom actions for menu
  const customActions = [
    {
      label: 'Thêm con',
      icon: 'IoMdAdd',
      color: 'success',
      onClick: handleAddChild
    }
  ];

  // Search functionality
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    if (!searchValue.trim()) {
      setFilteredMenus(menus);
      return;
    }

    const filterMenus = (menuList) => {
      const filtered = [];
      menuList.forEach((menu) => {
        const item = menu.item;
        const matchesSearch =
          item.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.path?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.menuType?.toLowerCase().includes(searchValue.toLowerCase());

        if (matchesSearch) {
          filtered.push(menu);
        } else if (menu.children && menu.children.length > 0) {
          const filteredChildren = filterMenus(menu.children);
          if (filteredChildren.length > 0) {
            filtered.push({
              ...menu,
              children: filteredChildren
            });
          }
        }
      });
      return filtered;
    };

    const searchFiltered = filterMenus(menus);
    applyAdvancedFilters(searchFiltered, activeFilters);
  };

  // Advanced filter functionality
  const applyAdvancedFilters = (menuList, filters) => {
    if (!filters || Object.keys(filters).length === 0) {
      setFilteredMenus(menuList);
      return;
    }

    // First flatten the menu tree to apply filters
    const flatMenus = listMenus(menuList);

    const filteredFlat = flatMenus.filter((menu) => {
      const item = menu.item;
      const hasChildren = menu.children && menu.children.length > 0;
      const menuType = hasChildren ? 'Parent' : menu.level > 0 ? 'Child' : 'Single';
      const menuRoles = item.roles || [];

      // Filter by menu type
      if (filters.menuType && menuType !== filters.menuType) {
        return false;
      }

      // Filter by has children
      if (filters.hasChildren !== '') {
        const hasChildrenBool = filters.hasChildren === 'true';
        if (hasChildren !== hasChildrenBool) {
          return false;
        }
      }

      // Filter by roles
      if (filters.roles && filters.roles.length > 0) {
        const hasMatchingRole = filters.roles.some((roleId) => menuRoles.includes(roleId));
        if (!hasMatchingRole) {
          return false;
        }
      }

      return true;
    });

    // Rebuild tree structure from filtered flat list
    const rebuildTree = (flatList) => {
      const rootMenus = flatList.filter((menu) => menu.level === 0);
      const buildChildren = (parentMenu, level) => {
        const children = flatList.filter((menu) => menu.level === level + 1 && menu.item.parentId === parentMenu.item.id);
        return children.map((child) => ({
          ...child,
          children: buildChildren(child, level + 1)
        }));
      };

      return rootMenus.map((root) => ({
        ...root,
        children: buildChildren(root, 0)
      }));
    };

    // If filtering by Child, just return the flat filtered list as tree structure
    if (filters.menuType === 'Child') {
      setFilteredMenus(filteredFlat.map((menu) => ({ ...menu, children: [] })));
    } else {
      setFilteredMenus(rebuildTree(filteredFlat));
    }
  };

  const handleAdvancedFilter = (filters) => {
    setActiveFilters(filters);
    const searchFiltered = searchTerm ? filteredMenus : menus;
    applyAdvancedFilters(searchFiltered, filters);
  };

  const handleResetFilter = () => {
    setActiveFilters({});
    const searchFiltered = searchTerm ? filteredMenus : menus;
    setFilteredMenus(searchFiltered);
  };

  // Pagination handlers
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
  };

  // Get paginated data
  const getPaginatedData = () => {
    const allData = listMenus(filteredMenus);
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return allData.slice(startIndex, endIndex);
  };

  // Define columns for the table
  const columns = [
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
          <Chip label={menuType} size="small" color={menuType === 'Parent' ? 'primary' : menuType === 'Child' ? 'secondary' : 'default'} />
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
            {/* Hiển thị tối đa 2 roles */}
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

            {/* Nút "..." với tooltip hiển thị tất cả roles */}
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

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={pageStyles.root}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography sx={pageStyles.title}>Menu Management</Typography>
          <Button sx={pageStyles.createButton} startIcon={<PlusOutlined />} onClick={() => setOpenCreateForm(true)}>
            Thêm mới
          </Button>
        </Stack>

        <MainCard
          sx={pageStyles.mainCard}
          title={
            <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
              <Box sx={pageStyles.searchContainer}>
                <TextField
                  placeholder="Tìm kiếm menu theo tên, đường dẫn..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ width: { xs: '100%', md: '400px' } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlined style={{ fontSize: '16px' }} />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <div style={pageStyles.actionButtons}>
                {selectedItems.length > 0 && (
                  <Button variant="contained" color="error" onClick={() => handleDelete(selectedItems)}>
                    Xóa {selectedItems.length} mục đã chọn
                  </Button>
                )}
                <Button variant="contained" color="warning" onClick={() => setShowAdvancedFilter((prev) => !prev)}>
                  <FilterOutlined style={pageStyles.filterIcon} /> Lọc nâng cao
                </Button>
              </div>
            </Stack>
          }
        >
          <Collapse in={showAdvancedFilter}>
            <Divider sx={pageStyles.collapseDivider} />
            <MenuAdvancedFilter availableRoles={availableRoles} onFilter={handleAdvancedFilter} />
          </Collapse>
        </MainCard>

        <MenuDataTable
          data={getPaginatedData()}
          columns={columns}
          loading={loading}
          showCheckbox={true}
          permissions={{
            edit: true,
            view: false,
            delete: true
          }}
          pagination={{ page, rowsPerPage, totalItems: listMenus(filteredMenus).length }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onSelectionChange={setSelectedItems}
          onEdit={(item) => {
            setCurrentItem(item);
            setOpenEditForm(true);
          }}
          onDelete={handleDelete}
          onAddChild={handleAddChild}
          enablePagination={true}
          selected={selectedItems}
          setSelected={setSelectedItems}
        />
      </Box>

      {/* Create Modal */}
      <ModalWrapper
        open={openCreateForm}
        title="Thêm mới"
        content={<MenuFormAction item={null} onClose={() => setOpenCreateForm(false)} />}
        showActions={false}
        onClose={() => setOpenCreateForm(false)}
        maxWidth="sm"
        styles={modalWrapperStyles}
      />

      {/* Edit Modal */}
      <ModalWrapper
        open={openEditForm}
        title="Chỉnh sửa"
        content={<MenuFormAction item={currentItem} onClose={() => setOpenEditForm(false)} />}
        showActions={false}
        onClose={() => setOpenEditForm(false)}
        maxWidth="md"
        styles={modalWrapperStyles}
      />

      {/* Modal for adding child menu */}
      <ModalWrapper
        open={childFormOpen}
        title={`Thêm menu con cho: ${parentMenuItem?.item?.name || ''}`}
        content={<MenuFormAction item={null} parentId={parentMenuItem?.item?.id} onClose={handleCloseChildForm} />}
        maxWidth="sm"
        showActions={false}
        onClose={handleCloseChildForm}
        styles={modalWrapperStyles}
      />
    </>
  );
}
