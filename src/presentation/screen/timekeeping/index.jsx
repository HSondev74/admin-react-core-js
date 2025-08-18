/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import timeKeepingApi from '../../../infrastructure/api/http/timeKeeping';

// Utils
import { formatDateVN } from '../../../app/utils/dateUtils';

// Custom components
import CustomDataPage from '../../components/CustomTable/CustomDataPage';
import TimeKeepingAdvancedFilter from './TimeKeepingAdvancedFilter';
import TimeKeepingActionForm from './TimeKeepingActionForm';

// Material UI
import { Chip, Box, Button, Stack, Typography } from '@mui/material';
// Ant Design Icons
import { ClockCircleOutlined, ScheduleOutlined, CheckCircleOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { pageStyles } from '../../assets/styles/pageStyles';

const TimeKeepingPage = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 10
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [openActionForm, setOpenActionForm] = useState(false);
  const [actionType, setActionType] = useState('CHECK_IN');

  // Prepare API parameters
  const timeKeepingParams = {
    page: pagination.page - 1,
    size: pagination.rowsPerPage,
    ...(searchTerm && { name: searchTerm }),
    ...(filters.workDateFrom && { workDateFrom: filters.workDateFrom }),
    ...(filters.workDateTo && { workDateTo: filters.workDateTo }),
    ...(filters.period && { period: filters.period }),
    ...(filters.checkType && { checkType: filters.checkType }),
    ...(filters.status && { status: filters.status }),
    ...(filters.source && { source: filters.source }),
    ...(filters.deviceCode && { deviceCode: filters.deviceCode })
  };

  // Fetch data using useSWR
  const {
    data: timeKeepingResponse,
    error: timeKeepingError,
    isLoading: loading
  } = useSWR(['timekeeping', timeKeepingParams], ([key, params]) => timeKeepingApi.getAllTimekeeping(params));

  const data = timeKeepingResponse?.data?.data || [];
  const totalItems = data.length;

  // Render status chip
  const renderStatusChip = (isLate, isEarly) => {
    if (isLate) {
      return <Chip icon={<ClockCircleOutlined />} label="Muộn" color="error" variant="filled" size="small" />;
    }
    if (isEarly) {
      return <Chip icon={<ScheduleOutlined />} label="Sớm" color="warning" variant="filled" size="small" />;
    }
    return <Chip icon={<CheckCircleOutlined />} label="Đúng giờ" color="success" variant="filled" size="small" />;
  };

  // Render check type
  const renderCheckType = (checkType) => {
    const color = checkType === 'CHECK_IN' ? 'primary' : 'secondary';
    const label = checkType === 'CHECK_IN' ? 'Vào' : 'Ra';

    return <Chip label={label} color={color} variant="outlined" size="small" />;
  };

  // Columns definition
  const columns = [
    {
      id: 'name',
      label: 'Tên nhân viên',
      minWidth: 180,
      sortable: true
    },
    {
      id: 'departmentName',
      label: 'Phòng ban',
      minWidth: 140,
      sortable: true
    },
    {
      id: 'workDate',
      label: 'Ngày làm việc',
      minWidth: 100,
      sortable: true,
      render: (value) => {
        if (!value) return 'N/A';
        return new Date(value).toLocaleDateString('vi-VN');
      }
    },
    {
      id: 'checkTime',
      label: 'Thời gian chấm công',
      minWidth: 100,
      sortable: true,
      render: (value) => formatDateVN(value)
    },
    {
      id: 'checkType',
      label: 'Loại chấm công',
      minWidth: 100,
      render: (value) => renderCheckType(value)
    },
    {
      id: 'status',
      label: 'Trạng thái',
      minWidth: 120,
      render: (value, row) => renderStatusChip(row.isLate, row.isEarly)
    },
    {
      id: 'period',
      label: 'Ca làm',
      minWidth: 60
    },
    {
      id: 'note',
      label: 'Ghi chú',
      minWidth: 200,
      render: (value) => (
        <Box
          sx={{
            maxWidth: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {value || 'N/A'}
        </Box>
      )
    }
  ];

  // Handlers
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

  // Check In/Check Out handlers
  const handleCheckIn = useCallback(() => {
    setActionType('CHECK_IN');
    setOpenActionForm(true);
  }, []);

  const handleCheckOut = useCallback(() => {
    setActionType('CHECK_OUT');
    setOpenActionForm(true);
  }, []);

  const handleCloseActionForm = useCallback(() => {
    setOpenActionForm(false);
  }, []);

  const handleActionSuccess = useCallback(() => {
    // Refresh data after successful check in/out
    mutate(['timekeeping', timeKeepingParams]);
  }, [timeKeepingParams]);

  return (
    <>
      {/* Check In/Check Out Buttons */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={pageStyles.title}>Quản lý chấm công</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="success" startIcon={<LoginOutlined />} onClick={handleCheckIn} sx={{ minWidth: 120 }}>
            Check In
          </Button>
          <Button variant="contained" color="error" startIcon={<LogoutOutlined />} onClick={handleCheckOut} sx={{ minWidth: 120 }}>
            Check Out
          </Button>
        </Stack>
      </Box>
      <CustomDataPage
        data={data}
        columns={columns}
        page="timekeeping"
        filterComponent={<TimeKeepingAdvancedFilter onFilter={handleFilter} />}
        searchPlaceholder="Tìm kiếm theo tên nhân viên..."
        onSearch={handleSearch}
        permissions={{
          assignRole: false,
          create: false,
          edit: false,
          view: false,
          delete: false
        }}
        showCheckbox={false}
        actionType="icon"
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
        emptyMessage="Không có dữ liệu chấm công"
      />

      {/* TimeKeeping Action Form */}
      <TimeKeepingActionForm
        open={openActionForm}
        onClose={handleCloseActionForm}
        actionType={actionType}
        onSuccess={handleActionSuccess}
      />
    </>
  );
};

export default TimeKeepingPage;
