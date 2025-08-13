import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Typography,
  DialogActions
} from '@mui/material';
import menuApi from '../../../infrastructure/api/http/menuApi';

const MenuFormAction = ({ item, parentId, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    path: '',
    parentId: '',
    menuType: '',
    roleIds: [],
    sortOrder: ''
  });
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250
      }
    }
  };

  // Load roles
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await menuApi.getRoles();
        setAvailableRoles(response.data || []);
      } catch (err) {
        console.error('Error loading roles:', err);
        setAvailableRoles([]);
      }
    };
    loadRoles();
  }, []);

  // Set form data when editing
  useEffect(() => {
    if (item) {
      const menuItem = item.item || item;
      setFormData({
        name: menuItem.name || '',
        path: menuItem.path || '',
        parentId: item.parentId || parentId || '',
        menuType: menuItem.menuType || '',
        roleIds: menuItem.roles || [],
        sortOrder: menuItem.sortOrder || ''
      });
    } else if (parentId) {
      // Creating child menu
      setFormData({
        name: '',
        path: '',
        parentId: parentId,
        menuType: '',
        roleIds: [],
        sortOrder: ''
      });
    }
  }, [item, parentId]);

  const handleSave = async () => {
    try {
      setLoading(true);

      if (item) {
        // Edit existing menu
        const menuId = item.item?.id || item.id;
        await menuApi.updateMenuItem(formData, menuId);
      } else {
        // Add new menu item
        await menuApi.addNewMenuItem(formData);
      }

      onClose();
      // Trigger parent component to refresh data
      if (window.refreshMenuData) {
        window.refreshMenuData();
      }
    } catch (error) {
      console.error('Error saving menu:', error);
      alert('Error saving menu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
        <TextField
          label="Tên menu"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          fullWidth
          required
        />

        <TextField label="Đường dẫn" value={formData.path} onChange={(e) => setFormData({ ...formData, path: e.target.value })} fullWidth />

        <FormControl fullWidth>
          <InputLabel>Loại menu</InputLabel>
          <Select
            value={formData.menuType}
            onChange={(e) => setFormData({ ...formData, menuType: e.target.value })}
            input={<OutlinedInput label="Loại menu" />}
          >
            <MenuItem value="MENU">MENU</MenuItem>
            <MenuItem value="BUTTON">BUTTON</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Vai trò</InputLabel>
          <Select
            multiple
            value={formData.roleIds}
            onChange={(e) => setFormData({ ...formData, roleIds: e.target.value })}
            input={<OutlinedInput label="Roles" />}
            renderValue={(selected) =>
              selected
                .map((roleId) => {
                  const role = availableRoles.find((r) => r.id === roleId);
                  return role?.name;
                })
                .join(', ')
            }
            MenuProps={MenuProps}
          >
            {availableRoles.map((role) => {
              const isChecked = formData.roleIds.includes(role.id);
              return (
                <MenuItem
                  key={role.id}
                  value={role.id}
                  onClick={async (e) => {
                    e.preventDefault();
                    if (isChecked && item) {
                      // If role is checked and we're editing, remove role from menu
                      try {
                        const menuId = item.item?.id || item.id;
                        await menuApi.deleteRoleFromMenu(menuId, role.id);
                        // Update local state
                        setFormData((prev) => ({
                          ...prev,
                          roleIds: prev.roleIds.filter((id) => id !== role.id)
                        }));
                        // Refresh parent data silently (no loading state)
                        setTimeout(() => {
                          if (window.refreshMenuData) {
                            window.refreshMenuData();
                          }
                        }, 100);
                      } catch (error) {
                        console.error('Error removing role:', error);
                        alert('Error removing role: ' + error.message);
                      }
                    } else {
                      // Normal add/remove behavior for unchecked roles
                      const newRoleIds = isChecked ? formData.roleIds.filter((id) => id !== role.id) : [...formData.roleIds, role.id];
                      setFormData({ ...formData, roleIds: newRoleIds });
                    }
                  }}
                >
                  <Checkbox checked={isChecked} />
                  <ListItemText primary={role.name} />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <TextField
          label="Thứ tự"
          type="number"
          value={formData.sortOrder}
          onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
          fullWidth
        />
      </Box>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading || !formData.name.trim()}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default MenuFormAction;
