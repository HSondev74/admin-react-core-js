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
import rolesApi from '../../../infrastructure/api/http/role';

const UserManagementPage = () => {
  // State
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);
  // const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 10,
    totalItems: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [roleList, setRoleList] = useState([]);

  //notification
  const { showNotification, hideNotification } = useNotification();

  // Handle switch lock/unlock
  const handleStatusToggle = useCallback(async (userId, currentStatus) => {
    setLoading(true);
    try {
      let response;
      const payload = { ids: [userId] };

      if (currentStatus === '9') {
        response = await usersApi.unlockUser(payload);
      } else {
        response = await usersApi.lockUser(payload);
      }

      // Refresh data sau khi update thành công
      await fetchData({
        page: pagination.page,
        size: pagination.rowsPerPage,
        sortBy: filters.sortBy || 'createTime',
        sortDirection: filters.sortDirection || 'DESC',
        searchTerm
      });
    } catch (error) {
      console.error('Có lỗi khi cập nhật trạng thái:', error);
    } finally {
      setLoading(false);
    }
  });

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
      render: (value, row) => (
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={value === '9'}
                onChange={() => handleStatusToggle(row.id, value)}
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
            label="Lock/Unlock"
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
        const resData = response?.data?.data;
        setData(resData.content);
        // setFilteredData(resData.content);
        setPagination({ page: resData?.pageNumber, rowsPerPage: resData?.pageSize, totalItems: resData?.totalElements });
      } catch (err) {
        console.log('Lỗi khi gọi API:', err);
      } finally {
        setLoading(false);
      }
    },
    [setPagination]
  );

  // pre-load get listrole with params
  const fetchRoleList = async () => {
    try {
      const response = await rolesApi.getAllRoles();
      setRoleList(response.data.data);
    } catch (err) {
      console.error('Lỗi khi gọi API lấy danh sách role:', err);
    }
  };

  useEffect(() => {
    fetchRoleList();
    fetchData({ page: pagination.page, size: pagination.rowsPerPage });
  }, []);

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

      const reqBody = {
        page: 1,
        size: pagination.rowsPerPage
      };

      if (searchTerm) reqBody.searchTerm = searchTerm;
      if (newFilters?.sortBy) reqBody.sortBy = newFilters.sortBy;
      if (newFilters?.sortDirection) reqBody.sortDirection = newFilters.sortDirection;

      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchData(reqBody);

      setLoading(false);
    },
    [data]
  );

  const handleChangePage = useCallback(
    (newPage) => {
      setPagination((prev) => {
        const reqBody = {
          page: newPage,
          size: prev.rowsPerPage
        };

        // Chỉ thêm vào nếu có giá trị
        if (searchTerm) reqBody.searchTerm = searchTerm;
        if (filters?.sortBy) reqBody.sortBy = filters.sortBy;
        if (filters?.sortDirection) reqBody.sortDirection = filters.sortDirection;

        fetchData(reqBody);
        return {
          ...prev,
          page: newPage
        };
      });
    },
    [fetchData, filters, searchTerm]
  );

  const handleChangeRowsPerPage = useCallback(
    (newRowsPerPage) => {
      setPagination((prev) => {
        const reqBody = {
          page: 0,
          size: prev.rowsPerPage
        };

        // Chỉ thêm vào nếu có giá trị
        if (searchTerm) reqBody.searchTerm = searchTerm;
        if (filters?.sortBy) reqBody.sortBy = filters.sortBy;
        if (filters?.sortDirection) reqBody.sortDirection = filters.sortDirection;

        fetchData(reqBody);
        return {
          ...prev,
          page: 0,
          rowsPerPage: newRowsPerPage
        };
      });
    },
    [fetchData, filters, searchTerm]
  );
  const handleCreate = useCallback(
    async (newData) => {
      try {
        const { lockFlag, ...rest } = newData;
        await usersApi.register(rest);

        showNotification('Thêm nhân viên thành công', 'success');
        await fetchData({
          page: pagination.page,
          size: pagination.rowsPerPage,
          sortBy: filters.sortBy || 'createTime',
          sortDirection: filters.sortDirection || 'DESC',
          searchTerm
        });
      } catch (error) {
        console.error('Có lỗi khi tạo nhân viên:', error);
        showNotification('Có lỗi xảy ra!', 'error');
      }
    },
    [fetchData, pagination.page, pagination.rowsPerPage, searchTerm, filters]
  );

  const handleEdit = useCallback(
    async (editedData) => {
      try {
        let response = await usersApi.updateUser(editedData.id, editedData);

        showNotification('Sửa nhân viên thành công', 'success');
        await fetchData({
          page: pagination.page,
          size: pagination.rowsPerPage,
          sortBy: filters.sortBy || 'createTime',
          sortDirection: filters.sortDirection || 'DESC',
          searchTerm
        });
      } catch (error) {
        console.error('Có lỗi khi cập nhật nhân viên:', error);
        showNotification('Có lỗi xảy ra!', 'error');
      }
    },
    [fetchData, pagination.page, pagination.rowsPerPage, searchTerm, filters]
  );

  const handleDelete = useCallback(
    async (itemToDelete) => {
      try {
        const response = await usersApi.deleteUsers(itemToDelete);

        showNotification('Xóa nhân viên thành công', 'success');
        await fetchData({
          page: pagination.page,
          size: pagination.rowsPerPage,
          sortBy: filters.sortBy || 'createTime',
          sortDirection: filters.sortDirection || 'DESC',
          searchTerm
        });
      } catch (error) {
        console.error('Có lỗi khi xóa nhân viên:', error);
        showNotification('Có lỗi xảy ra!', 'error');
      }
    },
    [fetchData, pagination.page, pagination.rowsPerPage, searchTerm, filters]
  );

  // Render component
  return (
    <CustomDataPage
      title="Quản Lý Nhân Viên"
      data={data}
      columns={columns}
      page="users"
      filterComponent={<UserAdvancedFilter onFilter={handleFilter} />}
      searchPlaceholder="Tìm kiếm theo tên, email, số điện thoại..."
      onSearch={handleSearch}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      permissions={{ assignRole: false, create: true, edit: true, view: true, delete: true }}
      showCheckbox={true}
      actionType="icon-text"
      createComponent={(props) => (
        <UserFormAction {...props} roleList={roleList} title="Thêm nhân viên mới" isView={false} onSubmit={handleCreate} />
      )}
      editComponent={(props) => (
        <UserFormAction {...props} roleList={roleList} title="Chỉnh sửa nhân viên" isView={false} onSubmit={handleEdit} />
      )}
      viewComponent={(props) => <UserFormAction {...props} roleList={roleList} title="Xem chi tiết nhân viên" isView={true} />}
      collapsible={false}
      loading={loading}
      onChangePage={handleChangePage}
      pagination={pagination}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      enableSearch={true}
      enableFilter={true}
      enablePagination={true}
    />
  );
};

export default UserManagementPage;
