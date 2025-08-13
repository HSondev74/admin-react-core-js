/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';

// Material UI components
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

// third-party
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

// style
import { formStyles, formViewStyles } from '../../assets/styles/formStyles';

const DictionaryItemFormAction = ({ item, onClose, onSubmit, title, isView, dictType }) => {
  const [dictionaryItem, setDictionaryItem] = useState(item);
  const isUpdate = !!item;

  // form handler
  const handleSubmit = (data) => {
    // Ensure dictType is included in the data
    const submitData = {
      ...data,
      dictType: dictType
    };
    onSubmit(submitData);
    onClose();
  };

  const initialValues = {
    id: dictionaryItem?.id || '',
    label: dictionaryItem?.label || '',
    value: dictionaryItem?.value || '',
    description: dictionaryItem?.description || '',
    dictType: dictType || dictionaryItem?.dictType || ''
  };

  const validationSchema = !isView
    ? Yup.object().shape({
        label: Yup.string().max(255, 'Nhãn không được vượt quá 255 ký tự').required('Nhãn là bắt buộc'),
        labelEn: Yup.string().max(255, 'Nhãn tiếng Anh không được vượt quá 255 ký tự'),
        value: Yup.string().max(100, 'Giá trị không được vượt quá 100 ký tự').required('Giá trị là bắt buộc'),
        description: Yup.string().max(500, 'Mô tả không được vượt quá 500 ký tự')
      })
    : null;

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
      {({ values, errors, touched, handleChange }) => (
        <Form>
          <Grid container spacing={2}>
            {/* Dictionary Type Display */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Loại từ điển:
                </Typography>
                <Chip label={dictType || 'Chưa xác định'} variant="outlined" color="primary" size="small" />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nhãn"
                name="label"
                value={values.label}
                onChange={handleChange}
                error={Boolean(touched.label && errors.label)}
                InputLabelProps={{ style: formStyles.label }}
                inputProps={{
                  style: isView ? formViewStyles.inputReadOnly : formStyles.input,
                  readOnly: isView
                }}
              />
              <FormHelperText sx={formStyles.helperText}>{touched.label && errors.label}</FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Giá trị"
                name="value"
                value={values.value}
                onChange={handleChange}
                error={Boolean(touched.value && errors.value)}
                InputLabelProps={{ style: formStyles.label }}
                inputProps={{
                  style: isView ? formViewStyles.inputReadOnly : formStyles.input,
                  readOnly: isView
                }}
                helperText="Giá trị được sử dụng trong hệ thống (VD: ACTIVE, INACTIVE, HIGH, MEDIUM, LOW)"
              />
              <FormHelperText sx={formStyles.helperText}>{touched.value && errors.value}</FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                name="description"
                value={values.description}
                onChange={handleChange}
                error={Boolean(touched.description && errors.description)}
                multiline
                rows={3}
                InputLabelProps={{ style: formStyles.label }}
                inputProps={{
                  style: isView ? formViewStyles.inputReadOnly : formStyles.input,
                  readOnly: isView
                }}
              />
              <FormHelperText sx={formStyles.helperText}>{touched.description && errors.description}</FormHelperText>
            </Grid>

            {/* Hidden field for dictType */}
            <input type="hidden" name="dictType" value={values.dictType} />
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
  );
};

export default DictionaryItemFormAction;
