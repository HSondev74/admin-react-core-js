import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
// Components
import CustomDataPage from '../../components/CustomTable/CustomDataPage';
import MenuFormAction from './MenuFormAction';
import MenuAdvancedFilter from './MenuAdvancedFilter';
// Utils and handlers
import { getMenuColumns } from './menuColumns';
// Api
import menuApi from '../../../infrastructure/api/http/menu';

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

  // Apply filters and search
  const applyFilters = (searchValue = searchTerm, filters = activeFilters) => {
    let result = [...menus];

    // Apply search filter
    if (searchValue?.trim()) {
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
      result = filterMenus(result);
    }

    // Apply advanced filters
    if (filters && Object.keys(filters).length > 0) {
      const filterByAdvanced = (menuList) => {
        return menuList
          .filter((menu) => {
            const item = menu.item;
            let matches = true;

            if (filters.menuType && filters.menuType !== '') {
              matches = matches && item.menuType === filters.menuType;
            }

            if (filters.hasChildren && filters.hasChildren !== '') {
              const hasChildren = menu.children && menu.children.length > 0;
              matches = matches && (filters.hasChildren === 'true' ? hasChildren : !hasChildren);
            }

            if (filters.roles && Array.isArray(filters.roles) && filters.roles.length > 0) {
              const itemRoles = item.roles || [];
              matches = matches && filters.roles.some((roleId) => itemRoles.includes(roleId));
            }

            return matches;
          })
          .map((menu) => ({
            ...menu,
            children: menu.children ? filterByAdvanced(menu.children) : []
          }));
      };
      result = filterByAdvanced(result);
    }

    setFilteredMenus(result);
    setPage(0); // Reset to first page when filters change
  };

  // Search functionality
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    applyFilters(searchValue, activeFilters);
  };

  // Advanced filter functionality
  const handleAdvancedFilter = (filters) => {
    setActiveFilters(filters);
    applyFilters(searchTerm, filters);
  };

  // Re-apply filters when menus data changes
  useEffect(() => {
    if (menus.length > 0) {
      applyFilters(searchTerm, activeFilters);
    }
  }, [menus]);

  // Pagination handlers
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Get paginated data
  const getPaginatedData = () => {
    const flatMenus = listMenus(filteredMenus, 0, expandedItems);
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return flatMenus.slice(startIndex, endIndex);
  };

  const getTotalItems = () => {
    return listMenus(filteredMenus, 0, expandedItems).length;
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

      // Update sort order via API
      await menuApi.updateSortOrder(sourceItem.item.id, targetItem.item.id, direction, 1);

      // Update local state instead of reloading
      const updateSortOrderInTree = (menuList) => {
        return menuList.map((menu) => {
          if (menu.item.id === sourceItem.item.id) {
            return { ...menu, item: { ...menu.item, sortOrder: targetItem.item.sortOrder } };
          }
          if (menu.item.id === targetItem.item.id) {
            return { ...menu, item: { ...menu.item, sortOrder: sourceItem.item.sortOrder } };
          }
          if (menu.children) {
            return { ...menu, children: updateSortOrderInTree(menu.children) };
          }
          return menu;
        });
      };

      const updatedMenus = updateSortOrderInTree(menus);
      setMenus(updatedMenus);
      setFilteredMenus(updateSortOrderInTree(filteredMenus));
    } catch (error) {
      console.error('Error updating sort order:', error);
    }
  };

  // Get columns configuration with sort logic
  const getColumnsWithSortLogic = () => {
    const flatMenus = listMenus(filteredMenus, 0, expandedItems);
    return getMenuColumns(expandedItems, handleToggleExpand, handleSortOrder, flatMenus);
  };

  const columns = getColumnsWithSortLogic();

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
        data={getPaginatedData()}
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
        pagination={{ page, rowsPerPage, totalItems: getTotalItems() }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onDelete={handleDelete}
        createComponent={({ item, onClose }) => <MenuFormAction item={item} onClose={onClose} />}
        editComponent={({ item, onClose }) => <MenuFormAction item={item} onClose={onClose} />}
      />
    </>
  );
}
