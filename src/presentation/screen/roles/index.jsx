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

import useSWR, { mutate } from 'swr';
import { isSuccessCode } from '../../../app/utils/constants';

const RoleManagementPage = () => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 10
  });
  const [filters, setFilters] = useState({});

  const rolesParams = {
    page: pagination.page - 1,
    size: pagination.rowsPerPage,
    ...(searchTerm && { searchTerm }),
    ...(filters.sortBy && { sortBy: filters.sortBy }),
    ...(filters.sortDirection && { sortDirection: filters.sortDirection })
  };

  const {
    data: rolesResponse,
    error: rolesError,
    isLoading: loading
  } = useSWR(['roles', rolesParams], ([key, params]) => rolesApi.getAllRoles(params));

  const data = rolesResponse?.data?.data?.content || [];
  const totalItems = rolesResponse?.data?.data?.totalElements || 0;

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

  const handleFilter = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Handlers
  const handleAssignRoleToUsers = useCallback(async (reqBody) => {
    try {
      const response = await rolesApi.assignRoleToUsers(reqBody);

      if (response.success || isSuccessCode(response.status)) {
        mutate((key) => Array.isArray(key) && key[0] === 'roles');
      }
    } catch (error) {
      console.error('Có lỗi khi gán chức vụ:', error);
    }
  }, []);

  const handleCreate = useCallback(async (newData) => {
    try {
      const response = await rolesApi.createRole(newData);

      if (response.success || isSuccessCode(response.status)) {
        mutate((key) => Array.isArray(key) && key[0] === 'roles');
      }
    } catch (error) {
      console.error('Có lỗi khi tạo chức vụ:', error);
    }
  }, []);

  const handleEdit = useCallback(async (editedData) => {
    try {
      const response = await rolesApi.updateRole(editedData);

      if (response.success || isSuccessCode(response.status)) {
        mutate((key) => Array.isArray(key) && key[0] === 'roles');
      }
    } catch (error) {
      console.error('Có lỗi khi cập chức vụ:', error);
    }
  }, []);

  const handleDelete = useCallback(async (itemToDelete) => {
    try {
      const response = await rolesApi.deleteRoles({ roleIds: itemToDelete });

      if (response.success || isSuccessCode(response.status)) {
        mutate((key) => Array.isArray(key) && key[0] === 'roles');
      }
    } catch (error) {
      console.error('Có lỗi khi xóa chức vụ:', error);
    }
  }, []);

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
      pagination={{ ...pagination, totalItems }}
      searchPlaceholder="Tìm kiếm theo mã chức vụ, tên chức vụ,..."
      enableSearch={true}
      enableFilter={false}
      enablePagination={true}
    />
  );
};

export default RoleManagementPage;
