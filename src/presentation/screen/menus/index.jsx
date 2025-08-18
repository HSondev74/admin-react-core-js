import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
// Components
import CustomDataPage from '../../components/CustomTable/CustomDataPage';
import MenuFormAction from './MenuFormAction';
import MenuAdvancedFilter from './MenuAdvancedFilter';
// Utils and handlers
import { getMenuColumns } from './menuColumns';
import { listMenus as listMenusUtil } from './menuUtils';
// Api
import menuApi from '../../../infrastructure/api/http/menuApi';

// List menu tree for table display with expand/collapse support
const listMenus = (menus, level = 0, expandedItems = []) => {
  const result = [];
  // Sort menus by sortOrder in ascending order
  const sortedMenus = [...menus].sort((a, b) => {
    const sortOrderA = a.item?.sortOrder || 0;
    const sortOrderB = b.item?.sortOrder || 0;
    return sortOrderA - sortOrderB;
  });

  sortedMenus.forEach((menu) => {
    result.push({ ...menu, level, id: menu.item?.id });
    if (menu.children && menu.children.length > 0 && expandedItems.includes(menu.item?.id)) {
      result.push(...listMenus(menu.children, level + 1, expandedItems));
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
  const [expandedItems, setExpandedItems] = useState([]);

  // Load menu tree data
  const loadMenus = async () => {
    try {
      setLoading(true);
      const response = await menuApi.getAllMenuTree();
      let menuData = [];
      if (response && Array.isArray(response.data)) {
        menuData = response.data;
      } else if (response && Array.isArray(response)) {
        menuData = response;
      }
      setMenus(menuData);
      setFilteredMenus(menuData);
      setError(null);
    } catch (err) {
      console.error('Error loading menus:', err);
      setError(err.message);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  // Expose refresh function globally for MenuFormAction
  useEffect(() => {
    window.refreshMenuData = loadMenus;
    return () => {
      delete window.refreshMenuData;
    };
  }, []);

  useEffect(() => {
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
      await loadMenus(); // Refresh data after delete
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };

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
            filtered.push({ ...menu, children: filteredChildren });
          }
        }
      });
      return filtered;
    };

    setFilteredMenus(filterMenus(menus));
  };

  // Advanced filter functionality
  const handleAdvancedFilter = (filters) => {
    setActiveFilters(filters);
    // Simple implementation - can be expanded if needed
    setFilteredMenus(menus);
  };

  // Pagination handlers
  const handleChangePage = (newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Handle expand/collapse
  const handleToggleExpand = (itemId) => {
    setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
  };

  // Handle sort order change
  const handleSortOrder = async (sourceItem, direction) => {
    try {
      const flatMenus = listMenus(filteredMenus, 0, expandedItems);
      const currentIndex = flatMenus.findIndex((menu) => menu.item.id === sourceItem.item.id);

      let targetIndex;
      if (direction === 'UP') {
        targetIndex = currentIndex - 1;
      } else {
        targetIndex = currentIndex + 1;
      }

      if (targetIndex < 0 || targetIndex >= flatMenus.length) {
        return; // Can't move beyond boundaries
      }

      const targetItem = flatMenus[targetIndex];

      await menuApi.updateSortOrder(sourceItem.item.id, targetItem.item.id, direction, 1);

      // Refresh data after successful update
      await loadMenus();
    } catch (error) {
      console.error('Error updating sort order:', error);
    }
  };

  // Get columns configuration
  const columns = getMenuColumns(expandedItems, handleToggleExpand, handleSortOrder);

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <CustomDataPage
        title="Quản lý Danh sách"
        data={listMenus(filteredMenus, 0, expandedItems)}
        columns={columns}
        loading={loading}
        showCheckbox={true}
        enablePagination={true}
        enableSearch={true}
        enableFilter={true}
        searchPlaceholder="Tìm kiếm menu theo tên, đường dẫn..."
        onSearch={handleSearch}
        filterComponent={<MenuAdvancedFilter availableRoles={availableRoles} onFilter={handleAdvancedFilter} />}
        permissions={{
          create: true,
          edit: true,
          view: false,
          delete: true
        }}
        pagination={{ page, rowsPerPage, totalItems: listMenusUtil(filteredMenus).length }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onDelete={handleDelete}
        createComponent={({ item, onClose }) => <MenuFormAction item={item} onClose={onClose} />}
        editComponent={({ item, onClose }) => <MenuFormAction item={item} onClose={onClose} />}
      />
    </>
  );
}
