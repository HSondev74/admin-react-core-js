import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
// Components
import CustomDataPage from '../../components/CustomTable/CustomDataPage';
import ModalWrapper from '../../components/CustomTable/ModalWrapper';
import MenuFormAction from './MenuFormAction';
import MenuAdvancedFilter from './MenuAdvancedFilter';
// Utils and handlers
import { getMenuColumns } from './menuColumns';
import { createMenuHandlers } from './menuHandlers';
// Styles
import { modalWrapperStyles } from '../../assets/styles/pageStyles';
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

  // Create handlers
  const {
    handleDelete: handleDeleteFromHandlers,
    handleSearch: handleSearchFromHandlers,
    handleAdvancedFilter,
    handleResetFilter,
    handleChangePage,
    handleChangeRowsPerPage,
    getPaginatedData
  } = createMenuHandlers(
    menus,
    setMenus,
    filteredMenus,
    setFilteredMenus,
    searchTerm,
    activeFilters,
    setActiveFilters,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage
  );

  // Update search term state
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    handleSearchFromHandlers(searchValue);
  };

  // Get columns configuration
  const columns = getMenuColumns(availableRoles);

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
        title="Menu Management"
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
        pagination={{ page, rowsPerPage, totalItems: listMenus(filteredMenus).length }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onDelete={handleDeleteFromHandlers}
        onAddChild={handleAddChild}
        createComponent={({ item, onClose }) => <MenuFormAction item={item} onClose={onClose} />}
        editComponent={({ item, onClose }) => <MenuFormAction item={item} onClose={onClose} />}
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
