/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import rolesApi from '../../../infrastructure/api/http/role';

// Material UI components
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';

// third-party
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

// style
import { formStyles, formViewStyles } from '../../assets/styles/formStyles';

const RoleFormAction = ({ item, onClose, onSubmit, title, isView }) => {
  const [role, setRole] = useState(item);
  const isUpdate = !!item;

  console.log(item);

  // get role detail by id

  const fetchRoleDetail = async () => {
    try {
      const response = await rolesApi.findRoleById(item.id);
      setRole(response.data);
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

    fetchRoleDetail();
  }, [item, isView]);

  // form handler

  const handleSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  const initialValues = {
    id: role?.id || 0,
    roleCode: role?.roleCode || '',
    roleName: role?.roleName || '',
    roleDesc: role?.roleDesc || ''
  };

  const validationSchema = !isView
    ? Yup.object().shape({
        roleCode: Yup.string().max(255, 'Mã chức vụ không được vượt quá 255 ký tự').required('Mã chức vụ là bắt buộc'),
        roleName: Yup.string().max(255, 'Tên chức vụ không được vượt quá 255 ký tự').required('Tên chức vụ là bắt buộc'),
        roleDesc: Yup.string().max(255, 'Quyền hạn không được vượt quá 255 ký tự').required('Quyền hạn là bắt buộc')
      })
    : null;

  return (
    <>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ values, errors, touched, handleChange }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mã chức vụ"
                  name="roleCode"
                  value={values.roleCode}
                  onChange={handleChange}
                  error={Boolean(touched.roleCode && errors.roleCode)}
                  InputLabelProps={{ style: formStyles.label }}
                  inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
                />
                <FormHelperText sx={formStyles.helperText}>{touched.roleCode && errors.roleCode}</FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên chức vụ"
                  name="roleName"
                  value={values.roleName}
                  onChange={handleChange}
                  error={Boolean(touched.roleName && errors.roleName)}
                  InputLabelProps={{ style: formStyles.label }}
                  inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
                />
                <FormHelperText sx={formStyles.helperText}>{touched.roleName && errors.roleName}</FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quyền hạn"
                  name="roleDesc"
                  value={values.roleDesc}
                  onChange={handleChange}
                  error={Boolean(touched.roleDesc && errors.roleDesc)}
                  InputLabelProps={{ style: formStyles.label }}
                  inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
                />
                <FormHelperText sx={formStyles.helperText}>{touched.roleDesc && errors.roleDesc}</FormHelperText>
              </Grid>
            </Grid>
            {!isView && ( // Chỉ hiển thị button khi không phải chế độ xem
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onClose} sx={formStyles.button}>
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary" sx={formStyles.button}>
                  {isUpdate ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Box>
            )}
            {isView && ( // Hiển thị button đóng khi ở chế độ xem
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

export default RoleFormAction;
