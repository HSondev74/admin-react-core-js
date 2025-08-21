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
  const [totalItems, setTotalItems] = useState(0);
  const [expandedItems, setExpandedItems] = useState([]);

  // Load menu data with filters
  const loadMenus = async (pageNum = page, pageSize = rowsPerPage, search = searchTerm, filters = activeFilters) => {
    try {
      setLoading(true);
      let response;

      // Check if any meaningful filters are applied
      const hasMenuTypeFilter = filters.menuType && filters.menuType !== '';
      const hasParentIdFilter = filters.parentId && filters.parentId !== '' && filters.parentId !== 'null';

      // Use specific API based on filters
      if (hasMenuTypeFilter && !hasParentIdFilter) {
        response = await menuApi.getMenusByTypeMenu(filters.menuType);
      } else if (hasParentIdFilter && !hasMenuTypeFilter) {
        response = await menuApi.getMenusByParentId(filters.parentId);
      } else {
        // Default: use paginated API when no filters or both filters are "Tất cả"
        const requestBody = {
          page: pageNum + 1,
          size: pageSize,
          sortBy: 'sortOrder',
          searchTerm: search || '',
          sortDirection: 'ASC',
          visible: 'string'
        };
        response = await menuApi.getMenusPaginated(requestBody);
      }

      let menuData = [];
      let totalItems = 0;

      if (response && response.data) {
        // Handle different response structures
        if (Array.isArray(response.data)) {
          menuData = response.data;
          totalItems = response.data.length;
        } else {
          menuData = response.data.content || response.data.data || [];
          totalItems = response.data.totalElements || response.data.total || menuData.length;
        }
      }

      setMenus(menuData);
      setFilteredMenus(menuData);
      setTotalItems(totalItems);
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

      // Reload data after delete
      loadMenus(page, rowsPerPage, searchTerm, activeFilters);
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };

  // Search functionality
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setPage(0);
    loadMenus(0, rowsPerPage, searchValue, activeFilters);
  };

  // Advanced filter functionality
  const handleAdvancedFilter = (filters) => {
    setActiveFilters(filters);
    setPage(0);
    loadMenus(0, rowsPerPage, searchTerm, filters);
  };

  // Pagination handlers
  const handleChangePage = (newPage) => {
    setPage(newPage - 1);
    loadMenus(newPage - 1, rowsPerPage, searchTerm, activeFilters);
  };

  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    loadMenus(0, newRowsPerPage, searchTerm, activeFilters);
  };

  // Get data with expand/collapse support
  const getPaginatedData = () => {
    const processedMenus = menus.map((item) => {
      // If item already has .item property (nested), use as is
      if (item.item) {
        return { ...item, level: 0, id: item.item.id };
      }
      // If item is flat, wrap it
      return { item, level: 0, children: [], id: item.id };
    });
    
    // Use listMenus function to handle expand/collapse
    return listMenus(processedMenus, 0, expandedItems);
  };

  // Handle expand/collapse
  const handleToggleExpand = (itemId) => {
    setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
  };

  // Handle sort order change
  const handleSortOrder = async (sourceItem, direction, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const flatMenus = getPaginatedData();
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

      // Reload data after sort
      loadMenus(page, rowsPerPage, searchTerm, activeFilters);
    } catch (error) {
      console.error('Error updating sort order:', error);
    }
  };

  // Get columns with sort functionality
  const getColumnsWithSort = () => {
    const flatMenus = getPaginatedData();
    return getMenuColumns(expandedItems, handleToggleExpand, handleSortOrder, flatMenus, page, rowsPerPage, totalItems);
  };

  const columns = getColumnsWithSort();

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
        pagination={{ page: page + 1, rowsPerPage, totalItems }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onDelete={handleDelete}
        createComponent={({ item, onClose }) => <MenuFormAction item={item} onClose={onClose} />}
        editComponent={({ item, onClose }) => <MenuFormAction item={item} onClose={onClose} />}
      />
    </>
  );
}
