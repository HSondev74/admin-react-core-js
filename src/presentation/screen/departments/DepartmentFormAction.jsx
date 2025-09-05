import { useEffect, useState } from 'react';
import departmentApi from '../../../infrastructure/api/http/department';

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
import { formStyles } from '../../assets/styles/formStyles';
// components
import TreeSelect from '../../components/TreeSelect/TreeSelect';
import CustomSelectField from '../../components/UI/CustomSelectField';

const validationSchema = Yup.object({
  name: Yup.string().required('Tên phòng ban là bắt buộc'),
  code: Yup.string().required('Mã phòng ban là bắt buộc'),
  description: Yup.string()
});

const DepartmentFormAction = ({ item, onClose, departmentOptions = [] }) => {
  const [loading, setLoading] = useState(false);
  const isUpdate = !!item;

  const initialValues = {
    name: item?.name || '',
    code: item?.code || '',
    description: item?.description || '',
    parentId: item?.parentId || null,
    lockFlag: item?.lockFlag || '0'
  };



  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setSubmitting(true);

      // Clean up data for API
      const formData = {
        name: values.name,
        code: values.code,
        parentId: values.parentId || null,
        lockFlag: values.lockFlag
      };

      console.log('Submitting data:', formData); // Debug log

      if (isUpdate) {
        // Update existing department
        await departmentApi.updateDepartment(item.id, formData);
      } else {
        // Create new department
        await departmentApi.addNewDepartment(formData);
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

  return (
    <>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TreeSelect
                  label="Danh sách phòng ban"
                  value={values.parentId}
                  onChange={(selectedId) => setFieldValue('parentId', selectedId)}
                  options={departmentOptions}
                  placeholder="Chọn phòng ban cha (để trống nếu là phòng ban gốc)..."
                  searchPlaceholder="Tìm kiếm phòng ban..."
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
                  label="Mã phòng ban"
                  name="code"
                  value={values.code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.code && errors.code)}
                  InputLabelProps={{ style: formStyles.label }}
                  inputProps={{ style: formStyles.input }}
                />
                {touched.code && errors.code && (
                  <FormHelperText error sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                    {errors.code}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên phòng ban"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.name && errors.name)}
                  InputLabelProps={{ style: formStyles.label }}
                  inputProps={{ style: formStyles.input }}
                />
                {touched.name && errors.name && (
                  <FormHelperText error sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                    {errors.name}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <CustomSelectField
                  label="Trạng thái"
                  name="lockFlag"
                  value={values.lockFlag}
                  onChange={handleChange}
                  options={[
                    { label: 'Hoạt động', value: '0' },
                    { label: 'Khóa', value: '9' }
                  ]}
                  error={Boolean(touched.lockFlag && errors.lockFlag)}
                />
                {touched.lockFlag && errors.lockFlag && (
                  <FormHelperText error sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                    {errors.lockFlag}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={onClose} sx={formStyles.button}>
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary" sx={formStyles.button} disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : isUpdate ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default DepartmentFormAction;
