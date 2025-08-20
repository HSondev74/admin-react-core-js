/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import menuApi from '../../../infrastructure/api/http/menu';

// Material UI components
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

// third-party
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

// style
import { formStyles, formViewStyles } from '../../assets/styles/formStyles';
// components
import TreeSelect from '../../components/TreeSelect/TreeSelect';
import IconSelector from '../../components/IconSelector/IconSelector';

const MenuFormAction = ({ item, parentId, onClose, onSubmit, title, isView }) => {
  const [menu, setMenu] = useState(item);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableMenus, setAvailableMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const isUpdate = !!item;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250
      }
    }
  };

  // Find parentId from menu tree
  const findParentId = (menus, targetId, parentId = null) => {
    for (const menu of menus) {
      if (menu.item?.id === targetId) {
        return parentId;
      }
      if (menu.children && menu.children.length > 0) {
        const found = findParentId(menu.children, targetId, menu.item?.id);
        if (found !== null) return found;
      }
    }
    return null;
  };

  // get menu detail by id
  const fetchMenuDetail = async () => {
    try {
      const response = await menuApi.getMenuById(item.id);
      const menuData = response.data;

      // If parentId is not in response, find it from menu tree
      if (!menuData.parentId && availableMenus.length > 0) {
        const foundParentId = findParentId(availableMenus, item.id);
        menuData.parentId = foundParentId;
      }

      setMenu(menuData);
    } catch (err) {
      console.error('Lỗi khi gọi API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!item || !isView) {
      return;
    }
    if (availableMenus.length > 0) {
      fetchMenuDetail();
    }
  }, [item, isView, availableMenus]);

  // Load roles and menus
  useEffect(() => {
    const loadData = async () => {
      try {
        const [rolesResponse, menusResponse] = await Promise.all([menuApi.getRoles(), menuApi.getAllMenuTree()]);
        setAvailableRoles(rolesResponse.data || []);
        setAvailableMenus(menusResponse.data || []);
      } catch (err) {
        console.error('Error loading data:', err);
        setAvailableRoles([]);
        setAvailableMenus([]);
      }
    };
    loadData();
  }, []);

  // form handler
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setSubmitting(true);

      // Clean up data for API
      const formData = { ...values };

      // Remove id for create operation
      if (!isUpdate) {
        delete formData.id;
      }

      // Keep icon as is for Ant Design
      if (!formData.icon) {
        delete formData.icon;
      }

      if (isUpdate) {
        // Update existing menu
        await menuApi.updateMenuItem(formData, formData.id);
      } else {
        // Create new menu
        await menuApi.addNewMenuItem(formData);
      }

      // Refresh menu data if available
      if (window.refreshMenuData) {
        await window.refreshMenuData();
      }

      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      console.error('Error details:', error.response?.data || error.message);
      setFieldError('name', 'Có lỗi xảy ra khi lưu dữ liệu');
    } finally {
      setSubmitting(false);
    }
  };

  const menuItem = menu?.item || menu;

  // Parse icon from fa-{style} fa-{name} format to just {name}
  const parseIcon = (iconString) => {
    if (!iconString) return '';
    const match = iconString.match(/fa-\w+ fa-(.+)/);
    return match ? match[1] : iconString;
  };

  const initialValues = {
    id: menuItem?.id || 0,
    name: menuItem?.name || '',
    path: menuItem?.path || '',
    parentId: menuItem?.parentId || menu?.parentId || parentId || null,
    menuType: menuItem?.menuType || '',
    roleIds: Array.isArray(menuItem?.roles) ? menuItem.roles : [],
    sortOrder: menuItem?.sortOrder || 0,
    icon: parseIcon(menuItem?.icon) || ''
  };

  const validationSchema = !isView
    ? Yup.object().shape({
        name: Yup.string().max(255, 'Tên menu không được vượt quá 255 ký tự').required('Tên menu là bắt buộc'),
        path: Yup.string().max(255, 'Đường dẫn không được vượt quá 255 ký tự'),
        menuType: Yup.string().required('Loại menu là bắt buộc'),
        sortOrder: Yup.number().min(0, 'Sắp xếp phải là số dương'),
        icon: Yup.string().max(100, 'Icon không được vượt quá 100 ký tự')
      })
    : null;

  return (
    <>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TreeSelect
                  label="Danh sách cha"
                  value={values.parentId}
                  onChange={(selectedId) => setFieldValue('parentId', selectedId)}
                  options={availableMenus}
                  placeholder="Chọn danh sách cha..."
                  searchPlaceholder="Tìm kiếm danh sách..."
                  disabled={isView}
                  error={Boolean(touched.parentId && errors.parentId)}
                />
                {touched.parentId && errors.parentId && (
                  <FormHelperText error sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                    {errors.parentId}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên menu"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.name && errors.name)}
                  InputLabelProps={{ style: formStyles.label }}
                  inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
                />
                {touched.name && errors.name && (
                  <FormHelperText error sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                    {errors.name}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Đường dẫn"
                  name="path"
                  value={values.path}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.path && errors.path)}
                  InputLabelProps={{ style: formStyles.label }}
                  inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
                />
                {touched.path && errors.path && (
                  <FormHelperText error sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                    {errors.path}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={Boolean(touched.menuType && errors.menuType)}>
                  <InputLabel style={formStyles.label}>Loại menu</InputLabel>
                  <Select
                    name="menuType"
                    value={values.menuType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    input={<OutlinedInput label="Loại menu" />}
                    inputProps={{ readOnly: isView }}
                    style={isView ? formViewStyles.inputReadOnly : formStyles.input}
                  >
                    <MenuItem value="MENU">Danh sách</MenuItem>
                    <MenuItem value="BUTTON">Nút</MenuItem>
                  </Select>
                  {touched.menuType && errors.menuType && (
                    <FormHelperText error sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                      {errors.menuType}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel style={formStyles.label}>Vai trò</InputLabel>
                  <Select
                    multiple
                    name="roleIds"
                    value={values.roleIds}
                    onChange={(e) => setFieldValue('roleIds', e.target.value)}
                    input={<OutlinedInput label="Vai trò" />}
                    renderValue={(selected) => {
                      if (!Array.isArray(selected)) return '';
                      return selected
                        .map((roleId) => {
                          const role = availableRoles.find((r) => r.id === roleId);
                          return role?.name;
                        })
                        .filter(Boolean)
                        .join(', ');
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ readOnly: isView }}
                    style={isView ? formViewStyles.inputReadOnly : formStyles.input}
                  >
                    {availableRoles.map((role) => {
                      const isChecked = values.roleIds.includes(role.id);
                      return (
                        <MenuItem key={role.id} value={role.id}>
                          <Checkbox checked={isChecked} />
                          <ListItemText primary={role.name} />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <IconSelector
                  label="Icon"
                  value={values.icon}
                  onChange={(iconName) => setFieldValue('icon', iconName)}
                  disabled={isView}
                  error={Boolean(touched.icon && errors.icon)}
                />
                {touched.icon && errors.icon && (
                  <FormHelperText error sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                    {errors.icon}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Sắp xếp"
                  name="sortOrder"
                  type="number"
                  value={values.sortOrder}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.sortOrder && errors.sortOrder)}
                  InputLabelProps={{ style: formStyles.label }}
                  inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
                />
                {touched.sortOrder && errors.sortOrder && (
                  <FormHelperText error sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                    {errors.sortOrder}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
            {!isView && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onClose} sx={formStyles.button}>
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary" sx={formStyles.button} disabled={isSubmitting}>
                  {isSubmitting ? 'Đang lưu...' : isUpdate ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Box>
            )}
            {isView && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onClose} sx={formStyles.button}>
                  Đóng
                </Button>
              </Box>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default MenuFormAction;
