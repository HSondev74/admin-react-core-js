/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import usersApi from '../../api/users';

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
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
// style
import { formStyles, formViewStyles } from '../../utils/style/formStyles';
import rolesApi from '../../api/roles';
import { validateForm } from '../../utils/formValidation';

const UserFormAction = ({ item, onClose, onSubmit, title, isView }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(item);
  const isUpdate = !!item;
  const [roleList, setRoleList] = useState([]);
  const [roleSearchValue, setRoleSearchValue] = useState('');

  // get detail user by id
  const fetchUserDetail = async () => {
    if (!item || !item.id) {
      return;
    }
    try {
      const response = await usersApi.findUserById(item.id);
      setUser({ ...response.data, roleList: response.data.roleList.map((role) => role.roleId) });
    } catch (err) {
      console.error('Lỗi khi gọi API:', err);
    } finally {
    }
  };

  // get listrole with params
  const fetchRoleList = async (roleSearchValue = '') => {
    try {
      const response = await rolesApi.getListRole({ roleName: roleSearchValue });
      setRoleList(response.data);
    } catch (err) {
      console.error('Lỗi khi gọi API lấy danh sách role:', err);
    }
  };

  useEffect(() => {
    if (!item || !isView) {
      fetchRoleList(roleSearchValue);
    }
    fetchUserDetail();
  }, [item, isView, roleSearchValue]);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  const initialValues = {
    ...user
  };

  const validationSchema = !isView ? validateForm(isUpdate) : null;

  return (
    <>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ values, errors, touched, handleChange, setFieldValue }) => {
          console.log('values', values.lockFlag);
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
                      getOptionLabel={(option) => option.roleName || ''}
                      // renderTags={() => null} // Không hiển thị tag
                      value={Array.isArray(values.roleList) ? roleList.filter((role) => values.roleList.includes(role.id)) : []}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(event, selectedValues) => {
                        setFieldValue(
                          'roleList',
                          selectedValues.map((role) => role.id)
                        );
                      }}
                      renderOption={(props, option) => {
                        const { key, ...rest } = props;
                        const isChecked = Array.isArray(values.roleList) && values.roleList.includes(option.id);
                        return (
                          <li key={key} {...rest} style={{ zIndex: 1 }}>
                            <Checkbox style={{ marginRight: 8 }} checked={isChecked} />
                            {option.roleName}
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
                      disabled={isView || roleList.length === 0}
                    />
                  </FormControl>
                  <FormHelperText sx={formStyles.helperText}>{touched.roleList && errors.roleList}</FormHelperText>
                </Grid>
                {/*Trạng thái*/}
                {/*<Grid item xs={12}>*/}
                {/*  <FormControl>*/}
                {/*    <FormLabel*/}
                {/*      id="lock-user-label"*/}
                {/*      style={formStyles.label}*/}
                {/*      sx={{ color: '#595959', '&.Mui-focused': { color: '#595959' } }}*/}
                {/*    >*/}
                {/*      Trạng thái*/}
                {/*    </FormLabel>*/}
                {/*    <RadioGroup*/}
                {/*      row*/}
                {/*      aria-labelledby="lock-user-label"*/}
                {/*      name="row-radio-buttons-group"*/}
                {/*      defaultValue={values.lockFlag}*/}
                {/*      onChange={(e) => {*/}
                {/*        setFieldValue('lockFlag', e.target.value);*/}
                {/*      }}*/}
                {/*    >*/}
                {/*      <FormControlLabel value="1" control={<Radio />} label="Lock" />*/}
                {/*      <FormControlLabel value="0" control={<Radio />} label="Unlock" />*/}
                {/*    </RadioGroup>*/}
                {/*  </FormControl>*/}
                {/*</Grid>*/}
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
