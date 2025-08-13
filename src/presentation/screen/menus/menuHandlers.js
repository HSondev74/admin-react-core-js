import { listMenus } from './menuUtils';
import menuApi from '../../../infrastructure/api/http/menuApi';

export const createMenuHandlers = (
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
) => {
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

  // Search functionality
  const handleSearch = (searchValue) => {
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

    const flatMenus = listMenus(menuList);
    const filteredFlat = flatMenus.filter((menu) => {
      const item = menu.item;
      const hasChildren = menu.children && menu.children.length > 0;
      const menuType = hasChildren ? 'Parent' : menu.level > 0 ? 'Child' : 'Single';
      const menuRoles = item.roles || [];

      if (filters.menuType && menuType !== filters.menuType) return false;
      if (filters.hasChildren !== '') {
        const hasChildrenBool = filters.hasChildren === 'true';
        if (hasChildren !== hasChildrenBool) return false;
      }
      if (filters.roles && filters.roles.length > 0) {
        const hasMatchingRole = filters.roles.some((roleId) => menuRoles.includes(roleId));
        if (!hasMatchingRole) return false;
      }
      return true;
    });

    if (filters.menuType === 'Child') {
      setFilteredMenus(filteredFlat.map((menu) => ({ ...menu, children: [] })));
    } else {
      // Rebuild tree structure
      const rebuildTree = (flatList) => {
        const rootMenus = flatList.filter((menu) => menu.level === 0);
        const buildChildren = (parentMenu, level) => {
          const children = flatList.filter((menu) => 
            menu.level === level + 1 && menu.item.parentId === parentMenu.item.id
          );
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
    setPage(0);
  };

  // Get paginated data
  const getPaginatedData = () => {
    const allData = listMenus(filteredMenus);
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return allData.slice(startIndex, endIndex);
  };

  return {
    handleDelete,
    handleSearch,
    handleAdvancedFilter,
    handleResetFilter,
    handleChangePage,
    handleChangeRowsPerPage,
    getPaginatedData
  };
};