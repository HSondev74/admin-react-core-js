/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import usersApi from '../../../infrastructure/api/http/users';
import rolesApi from '../../../infrastructure/api/http/role';

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
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 10
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const usersParams = {
    page: pagination.page - 1,
    size: pagination.rowsPerPage,
    ...(searchTerm && { searchTerm }),
    ...(filters.roleIds && { roleIds: [filters.roleIds] }),
    ...(filters.sortBy && { sortBy: filters.sortBy }),
    ...(filters.sortDirection && { sortDirection: filters.sortDirection })
  };

  const {
    data: usersResponse,
    error: usersError,
    isLoading: loading
  } = useSWR(['users', usersParams], ([key, params]) => usersApi.getListUser(params));

  const data = usersResponse?.data?.data?.content || [];
  const totalItems = usersResponse?.data?.data?.totalElements || 0;

  const { data: rolesResponse, error: rolesError, isLoading: rolesLoading } = useSWR('roles', () => rolesApi.getAllRoles());

  const roleList = rolesResponse?.data?.data || [];

  // Handle switch lock/unlock
  const handleStatusToggle = useCallback(async (userId, currentStatus) => {
    try {
      const payload = { ids: [userId] };

      if (currentStatus === '9') {
        await usersApi.unlockUser(payload);
      } else {
        await usersApi.lockUser(payload);
      }

      mutate((key) => Array.isArray(key) && key[0] === 'users');
    } catch (error) {
      console.error('Có lỗi khi cập nhật trạng thái:', error);
    }
  }, []);

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
      minWidth: 130,
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
      minWidth: 130
    },
    {
      id: 'lockFlag',
      label: 'Trạng thái',
      minWidth: 160,
      render: (value, row) => (
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={value === '9'}
                onChange={() => handleStatusToggle(row.id, value)}
                sx={{
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
            label="Lock/Unlock"
          />
        </FormGroup>
      )
    }
  ];

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleFilter = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleChangePage = useCallback((newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleChangeRowsPerPage = useCallback((newRowsPerPage) => {
    setPagination((prev) => ({ ...prev, page: 1, rowsPerPage: newRowsPerPage }));
  }, []);

  const handleCreate = useCallback(async (newData) => {
    try {
      const { lockFlag, ...rest } = newData;
      await usersApi.register(rest);

      mutate((key) => Array.isArray(key) && key[0] === 'users');
    } catch (error) {
      console.error('Có lỗi khi tạo nhân viên:', error);
    }
  }, []);

  const handleEdit = useCallback(async (editedData) => {
    try {
      await usersApi.updateUser(editedData.id, editedData);

      mutate((key) => Array.isArray(key) && key[0] === 'users');
    } catch (error) {
      console.error('Có lỗi khi cập nhật nhân viên:', error);
    }
  }, []);

  const handleDelete = useCallback(async (itemToDelete) => {
    try {
      await usersApi.deleteUsers(itemToDelete);

      mutate((key) => Array.isArray(key) && key[0] === 'users');
    } catch (error) {
      console.error('Có lỗi khi xóa nhân viên:', error);
    }
  }, []);

  // Render component
  return (
    <CustomDataPage
      title="Quản lý nhân viên"
      data={data}
      columns={columns}
      page="users"
      filterComponent={<UserAdvancedFilter onFilter={handleFilter} roleList={roleList.content || []} />}
      searchPlaceholder="Tìm kiếm theo tên, email, số điện thoại..."
      onSearch={handleSearch}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      permissions={{ assignRole: false, create: true, edit: true, view: true, delete: true }}
      showCheckbox={true}
      actionType="icon-text"
      createComponent={(props) => (
        <UserFormAction {...props} roleList={roleList.content} title="Thêm nhân viên mới" isView={false} onSubmit={handleCreate} />
      )}
      editComponent={(props) => (
        <UserFormAction {...props} roleList={roleList.content} title="Chỉnh sửa nhân viên" isView={false} onSubmit={handleEdit} />
      )}
      viewComponent={(props) => <UserFormAction {...props} roleList={roleList.content} title="Xem chi tiết nhân viên" isView={true} />}
      collapsible={false}
      loading={loading}
      onChangePage={handleChangePage}
      pagination={{
        ...pagination,
        totalItems
      }}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      enableSearch={true}
      enableFilter={true}
      enablePagination={true}
    />
  );
};

export default UserManagementPage;
