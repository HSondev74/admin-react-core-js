/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from 'react';
import usersApi from '../../../infrastructure/api/http/users';

// until
import { formatDateVN } from '../../../app/utils/dateUtils';

// Custom components
import CustomDataPage from '../../components/CustomTable/CustomDataPage';
// User components
import UserFormAction from './UserFormAction';
import UserAdvancedFilter from './UserAdvancedFilter'; // Component lọc nâng cao
//notification
import { useNotification } from '../../../contexts/NotificationContext';
import { Switch } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const UserManagementPage = () => {
  // State
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    totalItems: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  //notification
  const { showNotification, hideNotification } = useNotification();

  // Columns definition
  const columns = [
    {
      id: 'name',
      label: 'Tên nhân viên',
      minWidth: 150,
      sortable: true
    },
    {
      id: 'username',
      label: 'Tên đăng nhập',
      minWidth: 150,
      sortable: true
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 180,
      sortable: true
    },
    {
      id: 'phone',
      label: 'Số điện thoại',
      minWidth: 120
    },
    {
      id: 'lockFlag',
      label: 'Trạng thái',
      minWidth: 150,
      render: (value) => (
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={value === '1'}
                sx={{
                  marginLeft: { xs: '7vw', sm: '4vw', xl: '5vw' },
                  '& .MuiSwitch-switchBase': {
                    color: 'green',
                    '& + .MuiSwitch-track': {
                      backgroundColor: 'green'
                    }
                  },
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'red'
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'red'
                  }
                }}
              />
            }
            label="Lock"
          />
        </FormGroup>
      )
    }
  ];

  //check response code
  const isSuccessCode = (code) => code >= 200 && code < 300;

  const fetchData = useCallback(
    async (params) => {
      setLoading(true);
      try {
        const response = await usersApi.getListUser(params);
        const resData = response?.data;
        setData(resData.content);
        setFilteredData(resData.content);
        setPagination({ page: resData?.number, rowsPerPage: resData?.size, totalItems: resData?.totalElements });
      } catch (err) {
        console.log('Lỗi khi gọi API:', err);
      } finally {
        setLoading(false);
      }
    },
    [setPagination]
  );

  useEffect(() => {
    fetchData({ page: pagination.page, size: pagination.rowsPerPage });
  }, [fetchData]);

  // Handlers
  const handleSearch = useCallback(
    (term) => {
      setSearchTerm(term);
      applyFilters(term, filters);
    },
    [filters]
  );

  const handleFilter = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      applyFilters(searchTerm, newFilters);
    },
    [searchTerm]
  );

  const applyFilters = useCallback(
    (searchTerm, newFilters) => {
      setLoading(true);

      const { role, status, dateFrom, dateTo } = newFilters;

      setPagination((prev) => {
        fetchData({ page: 0, size: prev.rowsPerPage, dateFrom, dateTo, searchTerm });
        return {
          ...prev,
          page: 0,
          rowsPerPage: prev.rowsPerPage
        };
      });

      setLoading(false);
    },
    [data]
  );

  const handleChangePage = useCallback(
    (newPage) => {
      setPagination((prev) => {
        fetchData({ page: newPage, size: prev.rowsPerPage });
        return {
          ...prev,
          page: newPage
        };
      });
    },
    [fetchData]
  );

  const handleChangeRowsPerPage = useCallback(
    (newRowsPerPage) => {
      setPagination((prev) => {
        fetchData({ page: 0, size: newRowsPerPage });
        return {
          ...prev,
          page: 0,
          rowsPerPage: newRowsPerPage
        };
      });
    },
    [fetchData]
  );
  const handleCreate = useCallback(
    async (newData) => {
      try {
        const response = await usersApi.register(newData);

        if (!isSuccessCode(response.code)) {
          showNotification(response.msg, 'error');
        } else {
          showNotification('Thêm nhân viên thành công', 'success');
          await fetchData({ page: pagination.page, size: pagination.rowsPerPage });
        }
      } catch (error) {
        console.error('Có lỗi khi tạo nhân viên:', error);
        showNotification('Có lỗi xảy ra!', 'error');
      }
    },
    [fetchData, pagination.page, pagination.rowsPerPage, searchTerm, filters]
  );

  const handleEdit = useCallback(
    async (editedData) => {
      console.log('editData', editedData);
      try {
        let response = await usersApi.updateUser(editedData.id, editedData);

        if (!isSuccessCode(response.code)) {
          showNotification(response.msg, 'error');
        } else {
          showNotification('Sửa nhân viên thành công', 'success');
          await fetchData({ page: pagination.page, size: pagination.rowsPerPage });
        }
      } catch (error) {
        console.error('Có lỗi khi cập nhật nhân viên:', error);
        showNotification('Có lỗi xảy ra!', 'error');
      }
    },
    [data, searchTerm, filters]
  );

  const handleDelete = useCallback(
    async (itemToDelete) => {
      try {
        const response = await usersApi.deleteUsers(itemToDelete);

        if (!isSuccessCode(response.code)) {
          showNotification(response.msg, 'error');
        } else {
          showNotification('Xóa nhân viên thành công', 'success');
          await fetchData({ page: pagination.page, size: pagination.rowsPerPage });
        }
      } catch (error) {
        console.error('Có lỗi khi xóa nhân viên:', error);
        showNotification('Có lỗi xảy ra!', 'error');
      }
    },
    [data, searchTerm, filters]
  );

  // Render component
  return (
    <CustomDataPage
      title="Quản Lý Nhân Viên"
      data={filteredData}
      columns={columns}
      filterComponent={<UserAdvancedFilter onFilter={handleFilter} />}
      searchPlaceholder="Tìm kiếm theo tên, email, số điện thoại..."
      onSearch={handleSearch}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      permissions={{ create: true, edit: true, view: true, delete: true }}
      showCheckbox={true}
      actionType="icon-text"
      createComponent={(props) => <UserFormAction {...props} title="Thêm nhân viên mới" isView={false} onSubmit={handleCreate} />}
      editComponent={(props) => <UserFormAction {...props} title="Chỉnh sửa nhân viên" isView={false} onSubmit={handleEdit} />}
      viewComponent={(props) => <UserFormAction {...props} title="Xem chi tiết nhân viên" isView={true} />}
      collapsible={false}
      loading={loading}
      paginatePage={handleChangePage}
      onChangion={pagination}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      enableSearch={true}
      enableFilter={true}
      enablePagination={true}
    />
  );
};

export default UserManagementPage;
