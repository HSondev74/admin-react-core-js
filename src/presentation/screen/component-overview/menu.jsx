import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';

// Component
import MainCard from '../../components/MainCard';

// Icons
import { MdOutlineModeEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';

// Api
import menuApi from '../../../infrastructure/api/http/menuApi';

export default function MenuManagement() {
  const [open, setOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({ name: '', path: '', order: '' });

  useEffect(() => {
    const loadMenus = async () => {
      const response = await menuApi.getMenuTree();
      setMenus(response.data || []);
    };

    loadMenus();
  }, []);

  console.log('Current menus:', menus);

  const handleAdd = () => {
    setEditingMenu(null);
    setFormData({ name: '', path: '', order: '' });
    setOpen(true);
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setFormData(menu);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setMenus(menus.filter((menu) => menu.id !== id));
  };

  const handleSave = () => {
    if (editingMenu) {
      setMenus(menus.map((menu) => (menu.id === editingMenu.id ? { ...formData, id: editingMenu.id } : menu)));
    } else {
      setMenus([...menus, { ...formData, id: Date.now() }]);
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Path</TableCell>
              <TableCell>Order</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menus.map((menu) => (
              <TableRow key={menu.item.id}>
                <TableCell>{menu.item.name}</TableCell>
                <TableCell>{menu.item.path}</TableCell>
                <TableCell>{menu.item.sortOrder}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(menu)} color="primary">
                    <MdOutlineModeEdit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(menu.id)} color="error">
                    <MdDelete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
