/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from 'react';
import rolesApi from '../../../infrastructure/api/http/role';

// until
import { formatDateVN } from '../../../app/utils/dateUtils';

// Custom components
import CustomDataPage from '../../components/CustomTable/CustomDataPage';

import RoleFormAction from './RoleFormAction';

//notification
import { useNotification } from '../../../contexts/NotificationContext';

const RoleManagementPage = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 10,
    totalItems: 0
  });

  //notification
  const { showNotification, hideNotification } = useNotification();

  // Columns definition
  const columns = [
    {
      id: 'code',
      label: 'Mã chức vụ',
      minWidth: 150,
      sortable: true
    },
    {
      id: 'name',
      label: 'Tên chức vụ',
      minWidth: 150,
      sortable: true
    },
    {
      id: 'description',
      label: 'Quyền hạn',
      minWidth: 150,
      sortable: true
    },
    // {
    //   id: 'updateBy',
    //   label: 'Cập nhật bởi',
    //   minWidth: 150,
    //   sortable: true
    // },
    {
      id: 'createTime',
      label: 'Thời gian tạo',
      minWidth: 150,
      render: (value) => formatDateVN(value)
    },
    {
      id: 'updateTime',
      label: 'Thời gian sửa',
      minWidth: 150,
      render: (value) => formatDateVN(value)
    }
  ];

  //check response code
  const isSuccessCode = (code) => code >= 200 && code < 300;

  const fetchData = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await rolesApi.getAllRoles(params);
      setData(response.data.data.content);
    } catch (err) {
      console.log('Lỗi khi gọi API:', err);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const applyFilters = useCallback(
    async (searchTerm) => {
      setLoading(true);
      const reqBody = {
        page: 1,
        size: pagination.rowsPerPage
      };

      if (searchTerm) reqBody.searchTerm = searchTerm;
      setPagination((prev) => ({ ...prev, page: 1 }));
      await fetchData(reqBody);
      setLoading(false);
    },
    [data]
  );

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    applyFilters(term);
  }, []);

  // Handlers
  const handleAssignRoleToUsers = useCallback(
    async (reqBody) => {
      try {
        await rolesApi.assignRoleToUsers(reqBody);

        showNotification('Gán chức vụ thành công', 'success');
        await fetchData();
      } catch (error) {
        console.error('Có lỗi khi gán chức vụ:', error);
        showNotification('Có lỗi xảy ra!', 'error');
      }
    },
    [fetchData, showNotification, isSuccessCode]
  );

  const handleCreate = useCallback(
    async (newData) => {
      try {
        await rolesApi.createRole(newData);

        showNotification('Thêm chức vụ thành công', 'success');
        await fetchData();
      } catch (error) {
        console.error('Có lỗi khi tạo chức vụ:', error);
        showNotification('Có lỗi xảy ra!', 'error');
      }
    },
    [fetchData, showNotification, isSuccessCode]
  );

  const handleEdit = useCallback(
    async (editedData) => {
      try {
        await rolesApi.updateRole(editedData);

        showNotification('Sửa chức vụ thành công', 'success');
        await fetchData();
      } catch (error) {
        console.error('Có lỗi khi cập chức vụ:', error);
        showNotification('Có lỗi xảy ra!', 'error');
      }
    },
    [fetchData, showNotification, isSuccessCode]
  );

  const handleDelete = useCallback(
    async (itemToDelete) => {
      try {
        await rolesApi.deleteRoles({ roleIds: itemToDelete });

        showNotification('Xóa chức vụ thành công', 'success');
        await fetchData();
      } catch (error) {
        console.error('Có lỗi khi xóa chức vụ:', error);
        showNotification('Có lỗi xảy ra!', 'error');
      }
    },
    [fetchData, showNotification, isSuccessCode]
  );

  // Render component
  return (
    <CustomDataPage
      title="Quản lý chức vụ"
      data={data}
      columns={columns}
      page="roles"
      onSearch={handleSearch}
      onAssignRoleToUsers={handleAssignRoleToUsers}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      permissions={{ assignRole: true, create: true, edit: true, view: true, delete: true }}
      showCheckbox={true}
      actionType="icon-text"
      assignRoleComponent={(props) => (
        <RoleFormAction {...props} isAssignRole={true} title="Gán quyền cho nhân viên" isView={false} onSubmit={handleAssignRoleToUsers} />
      )}
      createComponent={(props) => (
        <RoleFormAction {...props} title="Thêm chức vụ mới" isAssignRole={false} isView={false} onSubmit={handleCreate} />
      )}
      editComponent={(props) => (
        <RoleFormAction {...props} title="Chỉnh sửa chức vụ" isAssignRole={false} isView={false} onSubmit={handleEdit} />
      )}
      viewComponent={(props) => <RoleFormAction {...props} title="Xem chi tiết chức vụ" isAssignRole={false} isView={true} />}
      collapsible={false}
      loading={loading}
      searchPlaceholder="Tìm kiếm theo mã chức vụ, tên chức vụ,..."
      enableSearch={true}
      enableFilter={false}
      enablePagination={true}
    />
  );
};

export default RoleManagementPage;
