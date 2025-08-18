/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from 'react';
import useSWR from 'swr';
import timeKeepingApi from '../../../infrastructure/api/http/timeKeeping';

// Utils
import { formatDateVN } from '../../../app/utils/dateUtils';

// Custom components
import CustomDataPage from '../../components/CustomTable/CustomDataPage';
import TimeKeepingAdvancedFilter from './TimeKeepingAdvancedFilter';

// Material UI
import { Chip, Box } from '@mui/material';
// Ant Design Icons
import { ClockCircleOutlined, ScheduleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const TimeKeepingPage = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 10
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  // Fetch data using useSWR
  const {
    data: timeKeepingResponse,
    error: timeKeepingError,
    isLoading: loading
  } = useSWR(['timekeeping', { searchTerm, filters, pagination }], () => timeKeepingApi.getAllTimekeeping());

  const data = timeKeepingResponse?.data?.data || [];

  // Filter data based on search term and filters
  const filteredData = data.filter((item) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        item.name?.toLowerCase().includes(searchLower) ||
        item.departmentName?.toLowerCase().includes(searchLower) ||
        item.note?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Advanced filters
    if (filters.showLateOnly && !item.isLate) return false;
    if (filters.showEarlyOnly && !item.isEarly) return false;
    if (filters.departmentName && item.departmentName !== filters.departmentName) return false;
    if (filters.checkType && item.checkType !== filters.checkType) return false;
    if (filters.dateFrom && new Date(item.workDate) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(item.workDate) > new Date(filters.dateTo)) return false;

    return true;
  });

  // Pagination
  const startIndex = (pagination.page - 1) * pagination.rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + pagination.rowsPerPage);
  const totalItems = filteredData.length;

  // Render status chip
  const renderStatusChip = (isLate) => {
    if (isLate) {
      return <Chip icon={<ClockCircleOutlined />} label="Muộn" color="error" variant="filled" size="small" />;
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
      minWidth: 150,
      sortable: true
    },
    {
      id: 'departmentName',
      label: 'Phòng ban',
      minWidth: 120,
      sortable: true
    },
    {
      id: 'workDate',
      label: 'Ngày làm việc',
      minWidth: 120,
      sortable: true,
      render: (value) => {
        if (!value) return 'N/A';
        return new Date(value).toLocaleDateString('vi-VN');
      }
    },
    {
      id: 'checkTime',
      label: 'Thời gian chấm công',
      minWidth: 160,
      sortable: true,
      render: (value) => formatDateVN(value)
    },
    {
      id: 'checkType',
      label: 'Loại chấm công',
      minWidth: 120,
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
      label: 'Ca làm việc',
      minWidth: 100
    },
    {
      id: 'scheduleType',
      label: 'Loại lịch',
      minWidth: 100
    },
    {
      id: 'note',
      label: 'Ghi chú',
      minWidth: 150,
      render: (value) => (
        <Box
          sx={{
            maxWidth: 150,
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

  const handleView = useCallback((item) => {
    console.log('View timekeeping record:', item);
    // Implement view logic if needed
  }, []);

  return (
    <CustomDataPage
      title="Quản lý chấm công"
      data={paginatedData}
      columns={columns}
      page="timekeeping"
      filterComponent={<TimeKeepingAdvancedFilter onFilter={handleFilter} />}
      searchPlaceholder="Tìm kiếm theo tên, phòng ban, ghi chú..."
      onSearch={handleSearch}
      onView={handleView}
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
  );
};

export default TimeKeepingPage;
