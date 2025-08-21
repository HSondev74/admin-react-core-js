/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from 'react';
import workScheduleApi from '../../../infrastructure/api/http/workschedule';

// until
import { formatDateVN } from '../../../app/utils/dateUtils';

// Material UI components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import { InfoCircleOutlined } from '@ant-design/icons';

// Custom components
import CustomDataPage from '../../components/CustomTable/CustomDataPage';

import WorkScheduleFormAction from './WorkScheduleFormAction';
import WorkScheduleAdvancedFilter from './WorkScheduleAdvancedFilter';
//notification

import useSWR, { mutate } from 'swr';
import { isSuccessCode } from '../../../app/utils/constants';

const WorkSchedulePage = () => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 10
  });
  const [filters, setFilters] = useState({});
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const schedulesParams = {
    page: pagination.page - 1,
    size: pagination.rowsPerPage,
    ...(searchTerm && { searchTerm }),
    ...(filters.sortBy && { sortBy: filters.sortBy }),
    ...(filters.sortDirection && { sortDirection: filters.sortDirection }),
    ...(filters.isActive !== '' && filters.isActive !== undefined && { active: filters.isActive === 'true' }),
    ...(filters.isDefault !== '' && filters.isDefault !== undefined && { default: filters.isDefault === 'true' })
  };

  const {
    data: schedulesResponse,
    error: schedulesError,
    isLoading: loading
  } = useSWR(['schedules', schedulesParams], ([key, params]) => workScheduleApi.getAllSchedules(params));

  const data = schedulesResponse?.data?.data || [];
  const totalItems = schedulesResponse?.data?.data?.totalElements || 0;

  // Columns definition for schedules table
  const scheduleColumns = [
    {
      id: 'name',
      label: 'Tên lịch làm việc',
      minWidth: 180,
      sortable: true
    },
    {
      id: 'description',
      label: 'Mô tả',
      minWidth: 180,
      sortable: true
    },
    {
      id: 'minimumWorkHours',
      label: 'Giờ làm tối thiểu',
      minWidth: 200,
      sortable: false,
      render: (value) => `${value || 0}h`
    },
    {
      id: 'maxLunchBreakMinutes',
      label: 'Nghỉ trưa tối đa',
      minWidth: 200,
      sortable: false,
      render: (value) => `${value || 0} phút`
    },
    {
      id: 'active',
      label: 'Trạng thái',
      minWidth: 150,
      render: (value) => (value ? 'Hoạt động' : 'Không hoạt động')
    }
  ];

  // Columns definition for workDays table
  const workDayColumns = [
    {
      id: 'dayOfWeek',
      label: 'Ngày',
      minWidth: 100,
      sortable: false
    },
    {
      id: 'workingDay',
      label: 'Làm việc',
      minWidth: 100,
      sortable: false,
      render: (value) => (
        <span
          style={{
            color: value ? '#4caf50' : '#f44336',
            fontWeight: 'bold'
          }}
        >
          {value ? 'Có' : 'Không'}
        </span>
      )
    },
    {
      id: 'morningCheckInStart',
      label: 'Sáng vào',
      minWidth: 100,
      sortable: false,
      render: (value) => value || '-'
    },
    {
      id: 'morningCheckOutDeadline',
      label: 'Sáng ra',
      minWidth: 100,
      sortable: false,
      render: (value) => value || '-'
    },
    {
      id: 'afternoonCheckInStart',
      label: 'Chiều vào',
      minWidth: 100,
      sortable: false,
      render: (value) => value || '-'
    },
    {
      id: 'afternoonCheckOutDeadline',
      label: 'Chiều ra',
      minWidth: 100,
      sortable: false,
      render: (value) => value || '-'
    }
  ];

  // Transform workDays data for selected schedule
  const getWorkDaysData = () => {
    if (!selectedSchedule) return [];

    const workDays = selectedSchedule.workDays || [];

    // Define day order from Monday to Sunday
    const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const dayNames = {
      MONDAY: 'Thứ 2',
      TUESDAY: 'Thứ 3',
      WEDNESDAY: 'Thứ 4',
      THURSDAY: 'Thứ 5',
      FRIDAY: 'Thứ 6',
      SATURDAY: 'Thứ 7',
      SUNDAY: 'Chủ nhật'
    };

    // Sort workDays by day order
    const sortedWorkDays = workDays.sort((a, b) => {
      return dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
    });

    return sortedWorkDays.map((day) => {
      // Xác định trạng thái làm việc dựa trên sự hiện diện của các ca
      const isWorking = !!(
        day.morningCheckInStart ||
        day.morningCheckInDeadline ||
        day.morningCheckOutStart ||
        day.morningCheckOutDeadline ||
        day.afternoonCheckInStart ||
        day.afternoonCheckInDeadline ||
        day.afternoonCheckOutStart ||
        day.afternoonCheckOutDeadline
      );

      return {
        id: day.id,
        dayOfWeek: dayNames[day.dayOfWeek] || day.dayOfWeek,
        workingDay: isWorking, // Sử dụng trạng thái làm việc được tính toán
        morningCheckInStart: day.morningCheckInStart?.substring(0, 5) || '-',
        morningCheckInDeadline: day.morningCheckInDeadline?.substring(0, 5) || '-',
        morningCheckOutStart: day.morningCheckOutStart?.substring(0, 5) || '-',
        morningCheckOutDeadline: day.morningCheckOutDeadline?.substring(0, 5) || '-',
        afternoonCheckInStart: day.afternoonCheckInStart?.substring(0, 5) || '-',
        afternoonCheckInDeadline: day.afternoonCheckInDeadline?.substring(0, 5) || '-',
        afternoonCheckOutStart: day.afternoonCheckOutStart?.substring(0, 5) || '-',
        afternoonCheckOutDeadline: day.afternoonCheckOutDeadline?.substring(0, 5) || '-',
        originalDay: day
      };
    });
  };

  const handleFilter = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Handlers
  const handleAssignScheduleToUsers = useCallback(async (reqBody) => {
    try {
      const response = await workScheduleApi.assignScheduleForUser(reqBody.userIds[0], reqBody.scheduleId);

      if (response.success || isSuccessCode(response.status)) {
        mutate((key) => Array.isArray(key) && key[0] === 'schedules');
      }
    } catch (error) {
      console.error('Có lỗi khi gán lịch làm việc:', error);
    }
  }, []);

  const handleCreate = useCallback(async (newData) => {
    try {
      const { id, ...data } = newData;
      const dataToCreate = { ...data, workDays: data.workDays.map(({ id, ...rest }) => rest) };

      const response = await workScheduleApi.createSchedule(dataToCreate);

      if (response.success || isSuccessCode(response.status)) {
        mutate((key) => Array.isArray(key) && key[0] === 'schedules');
      }
    } catch (error) {
      console.error('Có lỗi khi tạo lịch làm việc:', error);
    }
  }, []);

  const handleEdit = useCallback(async (editedData) => {
    try {
      const { id, ...data } = editedData;
      const dataToEdit = { ...data, workDays: data.workDays.map(({ id, ...rest }) => rest) };
      console.log(dataToEdit);

      const response = await workScheduleApi.updateSchedulebyId(editedData.id, dataToEdit);

      if (response.success || isSuccessCode(response.status)) {
        mutate((key) => Array.isArray(key) && key[0] === 'schedules');
        setSelectedSchedule(editedData);
      }
    } catch (error) {
      console.error('Có lỗi khi cập nhật lịch làm việc:', error);
    }
  }, []);

  const handleDelete = useCallback(async (itemToDelete) => {
    try {
      const deletePromises = itemToDelete.map((id) => workScheduleApi.deleteScheduleById(id));
      await Promise.all(deletePromises);

      mutate((key) => Array.isArray(key) && key[0] === 'schedules');
    } catch (error) {
      console.error('Có lỗi khi xóa lịch làm việc:', error);
    }
  }, []);

  const handleChangePage = useCallback((newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleChangeRowsPerPage = useCallback((newRowsPerPage) => {
    setPagination((prev) => ({ ...prev, page: 1, rowsPerPage: newRowsPerPage }));
  }, []);

  // Render component
  return (
    <Box>
      {/* Schedules Table */}
      <CustomDataPage
        title="Quản lý lịch làm việc"
        data={data}
        columns={scheduleColumns}
        page="schedules"
        filterComponent={<WorkScheduleAdvancedFilter onFilter={handleFilter} />}
        onSearch={handleSearch}
        onAssignRoleToUsers={handleAssignScheduleToUsers}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={setSelectedSchedule}
        permissions={{ assignSchedule: true, assignRole: false, create: true, edit: true, view: true, delete: true }}
        showCheckbox={true}
        actionType="icon-text"
        assignRoleComponent={(props) => (
          <WorkScheduleFormAction
            {...props}
            isAssignSchedule={true}
            title="Gán lịch làm việc cho nhân viên"
            isView={false}
            onSubmit={handleAssignScheduleToUsers}
          />
        )}
        createComponent={(props) => (
          <WorkScheduleFormAction
            {...props}
            title="Thêm lịch làm việc mới"
            isAssignSchedule={false}
            isView={false}
            onSubmit={handleCreate}
          />
        )}
        editComponent={(props) => (
          <WorkScheduleFormAction
            {...props}
            title="Chỉnh sửa lịch làm việc"
            isAssignSchedule={false}
            isView={false}
            onSubmit={handleEdit}
          />
        )}
        viewComponent={(props) => (
          <WorkScheduleFormAction {...props} title="Xem chi tiết lịch làm việc" isAssignSchedule={false} isView={true} />
        )}
        collapsible={false}
        loading={loading}
        onChangePage={handleChangePage}
        pagination={{ ...pagination, totalItems }}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        searchPlaceholder="Tìm kiếm theo tên lịch làm việc..."
        enableSearch={true}
        enableFilter={true}
        enablePagination={false}
      />

      {/* WorkDays Table */}
      {selectedSchedule ? (
        <Box sx={{ mt: 3 }}>
          <Alert severity="success" sx={{ mb: 2, backgroundColor: '#e8f5e8', border: '1px solid #4caf50' }}>
            <Typography variant="body1">
              Đang hiển thị chi tiết cho: <strong>{selectedSchedule.name}</strong>
            </Typography>
          </Alert>
          <CustomDataPage
            title={`Chi tiết ngày làm việc - ${selectedSchedule.name}`}
            data={getWorkDaysData()}
            columns={workDayColumns}
            page="workdays"
            permissions={{ assignRole: false, create: false, edit: false, view: false, delete: false }}
            showCheckbox={false}
            actionType="icon-text"
            collapsible={false}
            loading={false}
            enableSearch={false}
            enableFilter={false}
            enablePagination={false}
            enableSearchBar={false}
            editComponent={false}
            viewComponent={false}
          />
        </Box>
      ) : (
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
            <InfoCircleOutlined style={{ fontSize: '48px', color: '#9e9e9e', marginBottom: '16px' }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa chọn lịch làm việc
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vui lòng click vào một dòng trong bảng trên để xem chi tiết ngày làm việc
            </Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default WorkSchedulePage;
