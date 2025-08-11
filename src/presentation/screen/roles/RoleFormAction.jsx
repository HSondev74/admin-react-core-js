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

  // form handler
  const handleSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  const initialValues = {
    code: role?.code || '',
    name: role?.name || '',
    description: role?.description || ''
  };

  const validationSchema = !isView
    ? Yup.object().shape({
        code: Yup.string().max(255, 'Mã chức vụ không được vượt quá 255 ký tự').required('Mã chức vụ là bắt buộc'),
        name: Yup.string().max(255, 'Tên chức vụ không được vượt quá 255 ký tự').required('Tên chức vụ là bắt buộc'),
        description: Yup.string().max(255, 'Quyền hạn không được vượt quá 255 ký tự').required('Quyền hạn là bắt buộc')
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
                  name="code"
                  value={values.code}
                  onChange={handleChange}
                  error={Boolean(touched.code && errors.code)}
                  InputLabelProps={{ style: formStyles.label }}
                  inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
                />
                <FormHelperText sx={formStyles.helperText}>{touched.code && errors.code}</FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên chức vụ"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  error={Boolean(touched.name && errors.name)}
                  InputLabelProps={{ style: formStyles.label }}
                  inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
                />
                <FormHelperText sx={formStyles.helperText}>{touched.name && errors.name}</FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quyền hạn"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  error={Boolean(touched.description && errors.description)}
                  InputLabelProps={{ style: formStyles.label }}
                  inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
                />
                <FormHelperText sx={formStyles.helperText}>{touched.description && errors.description}</FormHelperText>
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
