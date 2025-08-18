/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';

// Material UI components
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';

// third-party
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

// style
import { formStyles, formViewStyles } from '../../assets/styles/formStyles';

const DictionaryFormAction = ({ item, onClose, onSubmit, title, isView }) => {
  const [dictionary, setDictionary] = useState(item);
  const isUpdate = !!item;

  // form handler
  const handleSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  const initialValues = {
    id: dictionary?.id || '',
    name: dictionary?.name || '',
    nameEn: dictionary?.nameEn || '',
    dictType: dictionary?.dictType || '',
    description: dictionary?.description || ''
  };

  const validationSchema = !isView
    ? Yup.object().shape({
        name: Yup.string().max(255, 'Tên từ điển không được vượt quá 255 ký tự').required('Tên từ điển là bắt buộc'),
        nameEn: Yup.string().max(255, 'Tên tiếng Anh không được vượt quá 255 ký tự'),
        dictType: Yup.string().max(100, 'Loại từ điển không được vượt quá 100 ký tự').required('Loại từ điển là bắt buộc'),
        description: Yup.string().max(500, 'Mô tả không được vượt quá 500 ký tự')
      })
    : null;

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
      {({ values, errors, touched, handleChange }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên từ điển"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={Boolean(touched.name && errors.name)}
                InputLabelProps={{ style: formStyles.label }}
                inputProps={{
                  style: isView ? formViewStyles.inputReadOnly : formStyles.input,
                  readOnly: isView
                }}
              />
              <FormHelperText sx={formStyles.helperText}>{touched.name && errors.name}</FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên tiếng Anh"
                name="nameEn"
                value={values.nameEn}
                onChange={handleChange}
                error={Boolean(touched.nameEn && errors.nameEn)}
                InputLabelProps={{ style: formStyles.label }}
                inputProps={{
                  style: isView ? formViewStyles.inputReadOnly : formStyles.input,
                  readOnly: isView
                }}
              />
              <FormHelperText sx={formStyles.helperText}>{touched.nameEn && errors.nameEn}</FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Loại từ điển"
                name="dictType"
                value={values.dictType}
                onChange={handleChange}
                error={Boolean(touched.dictType && errors.dictType)}
                InputLabelProps={{ style: formStyles.label }}
                inputProps={{
                  style: isView ? formViewStyles.inputReadOnly : formStyles.input,
                  readOnly: isView
                }}
                helperText="Định danh duy nhất cho loại từ điển (VD: USER_STATUS, PRIORITY_LEVEL)"
              />
              <FormHelperText sx={formStyles.helperText}>{touched.dictType && errors.dictType}</FormHelperText>
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

export default DictionaryFormAction;
