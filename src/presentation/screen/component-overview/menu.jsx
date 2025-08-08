import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
// Component
import MainCard from '../../components/MainCard';
import MenuTableRow from '../../components/cards/menuRow';
// Icons
import { IoMdAdd } from 'react-icons/io';
// Api
import menuApi from '../../../infrastructure/api/http/menuApi';

// List menu tree for table display
const listMenus = (menus, level = 0) => {
  const result = [];
  menus.forEach((menu) => {
    result.push({ ...menu, level });
    if (menu.children && menu.children.length > 0) {
      result.push(...listMenus(menu.children, level + 1));
    }
  });
  return result;
};

export default function MenuManagement() {
  const [open, setOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({ name: '', path: '', order: '' });

  useEffect(() => {
    const loadMenus = async () => {
      try {
        setLoading(true);
        const response = await menuApi.getMenuTree();

        // Get the menu data from the response
        let menuData = [];
        if (response && Array.isArray(response.data)) {
          menuData = response.data;
        } else {
          console.warn('Unexpected response structure:', response);
        }

        console.log('Processed menu data:', menuData);
        // Log each menu item structure
        menuData.forEach((menu, index) => {
          const item = menu.item || menu;
          console.log(`Menu ${index}:`, {
            id: item.id,
            name: item.name,
            hasChildren: !!menu.children
          });
        });

        setMenus(menuData);
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

  const handleAdd = async () => {
    await menuApi.addNewMenuItem();
    setEditingMenu(null);
    setFormData({ name: '', path: '', order: '', parentId: null });
    setOpen(true);
  };

  const handleAddChild = (parentMenu) => {
    const item = parentMenu.item || parentMenu;
    const parentId = item.id || item._id;
    setEditingMenu(null);
    setFormData({ name: '', path: '', order: '', parentId });
    setOpen(true);
  };

  const handleEdit = (menu) => {
    const item = menu.item || menu;
    setEditingMenu(menu);
    setFormData({
      name: item.name || '',
      path: item.path || '',
      order: item.sortOrder || item.order || 0,
      parentId: menu.parentId || null
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    const deleteRecursive = (menuList) => {
      return menuList.filter((menu) => {
        const item = menu.item || menu;
        const menuId = item.id || item._id;
        if (menuId === id || id.includes(menuId)) return false;
        if (menu.children) {
          menu.children = deleteRecursive(menu.children);
        }
        return true;
      });
    };
    setMenus(deleteRecursive(menus));
  };

  const addChildToParent = (menuList, parentId, newChild) => {
    return menuList.map((menu) => {
      const item = menu.item || menu;
      const menuId = item.id || item._id;

      if (menuId === parentId) {
        return {
          ...menu,
          children: [...(menu.children || []), newChild]
        };
      }

      if (menu.children) {
        return {
          ...menu,
          children: addChildToParent(menu.children, parentId, newChild)
        };
      }

      return menu;
    });
  };

  const handleSave = () => {
    const newItem = {
      item: {
        id: Date.now(),
        name: formData.name,
        path: formData.path,
        sortOrder: formData.order
      },
      children: []
    };

    if (editingMenu) {
      // Edit existing menu
      const updateMenu = (menuList) => {
        return menuList.map((menu) => {
          const item = menu.item || menu;
          const menuId = item.id || item._id;

          if (menuId === (editingMenu.item?.id || editingMenu.id)) {
            return {
              ...menu,
              item: {
                ...item,
                name: formData.name,
                path: formData.path,
                sortOrder: formData.order
              }
            };
          }

          if (menu.children) {
            return {
              ...menu,
              children: updateMenu(menu.children)
            };
          }

          return menu;
        });
      };

      setMenus(updateMenu(menus));
    } else {
      // Add new menu
      if (formData.parentId) {
        // Add as child
        setMenus(addChildToParent(menus, formData.parentId, newItem));
      } else {
        // Add as root menu
        setMenus([...menus, newItem]);
      }
    }

    setOpen(false);
  };

  return (
    <MainCard
      title="Menu Management"
      secondary={
        <Button variant="contained" startIcon={<IoMdAdd />} onClick={handleAdd}>
          Add Menu
        </Button>
      }
    >
      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography color="error">Error: {error}</Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: '70vh' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Menu Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Path</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Order</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(menus) &&
                  flattenMenus(menus).map((menu, index) => {
                    const menuKey = menu.item?.id || menu.id || `row-${index}`;
                    return (
                      <MenuTableRow
                        key={menuKey}
                        menu={menu}
                        level={menu.level}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAddChild={handleAddChild}
                      />
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingMenu ? 'Edit Menu' : 'Add Menu'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Menu Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <TextField label="Path" value={formData.path} onChange={(e) => setFormData({ ...formData, path: e.target.value })} fullWidth />
            <TextField
              label="Order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              fullWidth
            />
            {formData.parentId && (
              <Typography variant="body2" color="text.secondary">
                Adding as child menu
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
