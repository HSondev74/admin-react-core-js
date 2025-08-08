/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from 'react';
import rolesApi from '../../../infrastructure/api/http/role';

// Material UI components
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { SearchOutlined } from '@ant-design/icons';

// third-party
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

// style
import { formStyles, formViewStyles } from '../../assets/styles/formStyles';
import { Checkbox } from '@mui/material';
import usersApi from '../../../infrastructure/api/http/users';
import { debounce } from 'lodash-es';

const RoleFormAction = ({ item, onClose, onSubmit, title, isView, isAssignRole }) => {
  const [role, setRole] = useState(item);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalItems: 0
  });
  const isUpdate = !!item;

  // Lọc user chỉ nằm trong role này
  const fetchAvailableUsers = useCallback(
    async (params = {}) => {
      if (!isAssignRole) return;
      setLoading(true);
      try {
        const reqBody = {
          page: params.page !== undefined ? params.page + 1 : pagination.page + 1,
          size: params.size || pagination.size
        };

        if (params.searchTerm) {
          reqBody.searchTerm = params.searchTerm;
        }

        let response;

        if (!isView && item?.id) {
          response = await usersApi.getListUser(reqBody);
          const allUsers = response?.data?.data?.content || [];

          const assignedResponse = await usersApi.getListUser({ roleIds: [item.id] });
          const assignedUserIds = assignedResponse?.data?.data?.content?.map((user) => user.id) || [];

          const availableUsers = allUsers.filter((user) => !assignedUserIds.includes(user.id));

          if (response?.data?.data) {
            response.data.data.content = availableUsers;
            response.data.data.totalElements = availableUsers.length;
          }
        } else {
          response = await usersApi.getListUser(reqBody);
        }

        const responseData = response?.data?.data;
        setUserList(responseData?.content || []);
        setPagination((prev) => ({
          ...prev,
          page: responseData?.pageNumber !== undefined ? responseData.pageNumber - 1 : params.page !== undefined ? params.page : prev.page,
          size: responseData?.pageSize || params.size || prev.size,
          totalItems: responseData?.totalElements || 0
        }));
      } catch (error) {
        setUserList([]);
      } finally {
        setLoading(false);
      }
    },
    [isAssignRole, isView, item?.id]
  );

  // Debounce search
  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue) => {
        if (isAssignRole) {
          fetchAvailableUsers({
            searchTerm: searchValue,
            page: 0,
            size: pagination.size
          });
        }
      }, 500),
    [isAssignRole, pagination.size]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    if (isAssignRole) {
      fetchAvailableUsers({
        page: 0,
        size: 10
      });
    }
  }, [item?.id, isView, isAssignRole, fetchAvailableUsers]);

  // form handler
  const handleSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChangePage = (e, newPage) => {
    fetchAvailableUsers({
      searchTerm: searchTerm,
      page: newPage,
      size: pagination.size
    });
  };

  const handleChangeRowsPerPage = (e) => {
    const newSize = parseInt(e.target.value, 10);
    fetchAvailableUsers({
      searchTerm: searchTerm,
      page: 0,
      size: newSize
    });
  };

  const handleSelectAllClick = (e, setFieldValue, values) => {
    if (e.target.checked) {
      const newSelecteds = userList.map((user) => user.id);
      setFieldValue('userIds', [...new Set([...values.userIds, ...newSelecteds])]);
      return;
    }
    const currentPageUserIds = userList.map((user) => user.id);
    setFieldValue(
      'userIds',
      values.userIds.filter((id) => !currentPageUserIds.includes(id))
    );
  };

  const handleClick = (event, userId, setFieldValue, values) => {
    const selectedIndex = values.userIds.indexOf(userId);
    let newSelected = [...values.userIds];

    if (selectedIndex === -1) {
      newSelected.push(userId);
    } else {
      newSelected.splice(selectedIndex, 1);
    }

    setFieldValue('userIds', newSelected);
  };

  const isAllCurrentPageSelected = (values) => {
    return userList.length > 0 && userList.every((user) => values.userIds.includes(user.id));
  };

  const isSomeCurrentPageSelected = (values) => {
    return userList.some((user) => values.userIds.includes(user.id)) && !isAllCurrentPageSelected(values);
  };

  const initialValues = isAssignRole
    ? { roleId: role?.id, userIds: [] }
    : {
        id: role?.id || '',
        code: role?.code || '',
        name: role?.name || '',
        description: role?.description || ''
      };

  const validationSchema = !isView
    ? isAssignRole
      ? Yup.object().shape({
          userIds: Yup.array().min(1, 'Vui lòng chọn ít nhất một người dùng').required('Danh sách người dùng là bắt buộc')
        })
      : Yup.object().shape({
          code: Yup.string().max(255, 'Mã chức vụ không được vượt quá 255 ký tự').required('Mã chức vụ là bắt buộc'),
          name: Yup.string().max(255, 'Tên chức vụ không được vượt quá 255 ký tự').required('Tên chức vụ là bắt buộc'),
          description: Yup.string().max(255, 'Quyền hạn không được vượt quá 255 ký tự').required('Quyền hạn là bắt buộc')
        })
    : null;

  return (
    <>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form>
            {!isAssignRole ? (
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
            ) : (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant="h6" gutterBottom>
                    Gán quyền {item?.name || ''} cho người dùng
                  </Typography>

                  {/* Search Field */}
                  <TextField
                    fullWidth
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchOutlined />
                        </InputAdornment>
                      )
                    }}
                    sx={{ mb: 2 }}
                    disabled={isView || loading}
                  />

                  {/* Users Table */}
                  <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <Table aria-label="user selection table">
                      <TableHead
                        sx={{
                          position: 'sticky',
                          top: 0,
                          zIndex: 1,
                          '& .MuiTableCell-head': {
                            backgroundColor: 'background.paper',
                            borderBottom: '1px solid rgba(224, 224, 224, 1)'
                          }
                        }}
                      >
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              indeterminate={isSomeCurrentPageSelected(values)}
                              checked={isAllCurrentPageSelected(values)}
                              onChange={(event) => handleSelectAllClick(event, setFieldValue, values)}
                              disabled={isView || loading}
                            />
                          </TableCell>
                          <TableCell>Tên người dùng</TableCell>
                          <TableCell>Email</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              Đang tải...
                            </TableCell>
                          </TableRow>
                        ) : userList.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              {searchTerm ? 'Không tìm thấy người dùng phù hợp' : 'Không có người dùng khả dụng'}
                            </TableCell>
                          </TableRow>
                        ) : (
                          userList.map((user) => {
                            const isItemSelected = values.userIds.includes(user.id);
                            return (
                              <TableRow
                                hover
                                onClick={(event) => !isView && handleClick(event, user.id, setFieldValue, values)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={user.id}
                                selected={isItemSelected}
                                sx={{ cursor: isView ? 'default' : 'pointer' }}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={isItemSelected}
                                    disabled={isView || loading}
                                    onChange={(event) => handleClick(event, user.id, setFieldValue, values)}
                                  />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {user.name || 'N/A'}
                                </TableCell>
                                <TableCell>{user.email || 'N/A'}</TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Pagination */}
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={pagination.totalItems}
                    rowsPerPage={pagination.size}
                    page={pagination.page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số hàng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`}
                  />

                  {/* Selected Count */}
                  {values.userIds.length > 0 && (
                    <Typography variant="body2" sx={{ mt: 1, color: 'primary.main' }}>
                      Đã chọn: {values.userIds.length} người dùng
                    </Typography>
                  )}
                </FormControl>
                <FormHelperText sx={formStyles.helperText}>{touched.userIds && errors.userIds}</FormHelperText>
              </Grid>
            )}

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
