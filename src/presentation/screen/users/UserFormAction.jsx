/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import usersApi from '../../../infrastructure/api/http/users';

// Material UI components
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import { FormLabel, Radio, RadioGroup } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
//antd-icon
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
// third-party
import { Formik, Form } from 'formik';
// style
import { formStyles, formViewStyles } from '../../assets/styles/formStyles';
import { validateForm } from '../../../app/utils/formValidation';
import { arraysEqual } from '../../../app/utils/constants';

const UserFormAction = ({ item, onClose, onSubmit, title, isView, roleList }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(item);
  const isUpdate = !!item;
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);

  // Xử lý submit những field có thay đổi khi isUpdate
  const getChangedField = (original, current) => {
    const changes = {};

    const fieldsToCheck = ['name', 'email', 'phone', 'roleIds'];

    fieldsToCheck.forEach((field) => {
      // Xử lý riêng roles
      if (field === 'roleIds') {
        const originalroles = original.roleIds || [];
        const currentroles = current.roleIds || [];
        if (!arraysEqual(originalroles, currentroles)) {
          changes.roleIds = currentroles;
        }
      }
      // Xử lý các field còn lại
      else {
        const originalValue = original[field] || '';
        const currentValue = current[field] || '';

        if (originalValue !== currentValue) {
          changes[field] = currentValue;
        }
      }
    });

    // Luôn gửi kèm Id khi update
    if (isUpdate && original.id) {
      changes.id = original.id;
    }

    return changes;
  };

  // get detail user by id
  const fetchUserDetail = async () => {
    if (!item || !item.id) {
      return;
    }
    setLoading(true);
    try {
      const response = await usersApi.findUserById(item.id);
      const userData = { ...response.data.data, roleIds: response.data.data.roles.map((role) => role.id) };
      setUser(userData);
      setOriginalData(userData);
    } catch (err) {
      console.error('Lỗi khi gọi API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [item]);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (data) => {
    let dataToSubmit;

    if (isUpdate) {
      dataToSubmit = getChangedField(originalData, data);

      const hasChanges = Object.keys(dataToSubmit).length > 1;
      if (!hasChanges) {
        onClose();
        return;
      }
    } else {
      dataToSubmit = { ...data };
    }
    onSubmit(dataToSubmit);
    onClose();
  };

  const initialValues = {
    name: user?.name || '',
    username: user?.username || '',
    password: user?.password || '',
    email: user?.email || '',
    phone: user?.phone || '',
    roleIds: user?.roleIds || [],
    lockFlag: user?.lockFlag || '0',
    ...user
  };

  const validationSchema = !isView ? validateForm(isUpdate) : null;

  return (
    <>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ values, errors, touched, handleChange, setFieldValue }) => {
          return (
            <Form>
              <Grid container spacing={2}>
                {/*Name*/}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tên người dùng"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    error={Boolean(touched.name && errors.name)}
                    InputLabelProps={{ style: formStyles.label }}
                    inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
                  />
                  <FormHelperText sx={formStyles.helperText}>{touched.name && errors.name}</FormHelperText>
                </Grid>
                {/*Username*/}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tên đăng nhập"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    error={Boolean(touched.username && errors.username)}
                    disabled={isUpdate}
                    InputLabelProps={{ style: formStyles.label }}
                    inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
                  />
                  <FormHelperText sx={formStyles.helperText}>{touched.username && errors.username}</FormHelperText>
                </Grid>
                {/*Password*/}
                {!isUpdate && (
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined" error={Boolean(touched.password && errors.password)}>
                      <InputLabel htmlFor="current-password" style={formStyles.label}>
                        Mật khẩu
                      </InputLabel>
                      <OutlinedInput
                        id="current-password"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        name="password"
                        onChange={handleChange}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <EyeInvisibleOutlined fontSize="small" /> : <EyeOutlined fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Mật khẩu"
                        inputProps={{
                          style: isView ? formViewStyles.inputReadOnly : formStyles.input,
                          readOnly: isView
                        }}
                      />
                      <FormHelperText sx={formStyles.helperText}>{touched.password && errors.password}</FormHelperText>
                    </FormControl>
                  </Grid>
                )}
                {/*Email*/}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    error={Boolean(touched.email && errors.email)}
                    InputLabelProps={{ style: formStyles.label }}
                    inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
                  />
                  <FormHelperText sx={formStyles.helperText}>{touched.email && errors.email}</FormHelperText>
                </Grid>
                {/*Phone number*/}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    error={Boolean(touched.phone && errors.phone)}
                    InputLabelProps={{ style: formStyles.label }}
                    inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
                  />
                  <FormHelperText sx={formStyles.helperText}>{touched.phone && errors.phone}</FormHelperText>
                </Grid>
                {/*Role List*/}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="roleList"
                      multiple
                      options={roleList}
                      disableCloseOnSelect
                      loading={loading}
                      getOptionLabel={(option) => option.name || ''}
                      // renderTags={() => null} // Không hiển thị tag
                      value={Array.isArray(values.roleIds) ? roleList.filter((role) => values.roleIds.includes(role.id)) : []}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(event, selectedValues) => {
                        setFieldValue(
                          'roleIds',
                          selectedValues.map((role) => role.id)
                        );
                      }}
                      renderOption={(props, option) => {
                        const { key, ...rest } = props;
                        const isChecked = Array.isArray(values.roleIds) && values.roleIds.includes(option.id);
                        return (
                          <li key={key} {...rest} style={{ zIndex: 1 }}>
                            <Checkbox style={{ marginRight: 8 }} checked={isChecked} />
                            {option.name}
                          </li>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Quyền tài khoản"
                          placeholder="Search..."
                          InputLabelProps={{ style: formStyles.label }}
                          InputProps={{
                            ...params.InputProps,
                            style: isView ? formViewStyles.inputReadOnly : formStyles.input
                          }}
                        />
                      )}
                      disabled={isView || loading}
                      noOptionsText={loading ? 'Đang tải...' : 'Không có quyền khả dụng'}
                    />
                  </FormControl>
                  <FormHelperText sx={formStyles.helperText}>{touched.roleList && errors.roleList}</FormHelperText>
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
          );
        }}
      </Formik>
    </>
  );
};

export default UserFormAction;
