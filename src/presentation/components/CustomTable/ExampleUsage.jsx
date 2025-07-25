/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useRef } from 'react';

// Material UI components
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

// Custom components
import CustomDataPage from './CustomDataPage';

// Mock data
const generateMockData = (count) => {
  const statuses = ['Hoạt động', 'Tạm ngưng', 'Đã khóa'];
  const roles = ['Admin', 'Quản lý', 'Nhân viên', 'Khách hàng'];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Người dùng ${index + 1}`,
    email: `user${index + 1}@example.com`,
    phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    // Thêm dữ liệu chi tiết cho phần collapse
    details: {
      address: `Địa chỉ ${index + 1}, Quận ${Math.floor(Math.random() * 12) + 1}, TP. Hồ Chí Minh`,
      department: ['Kinh doanh', 'Kỹ thuật', 'Nhân sự', 'Kế toán'][Math.floor(Math.random() * 4)],
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString('vi-VN'),
      lastLogin: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleString('vi-VN')
    }
  }));
};

// Form component cho tạo mới và chỉnh sửa
const UserForm = ({ item, onClose, onSubmit, title }) => {
  const [formData, setFormData] = useState(
    item || {
      name: '',
      email: '',
      phone: '',
      role: '',
      status: 'Hoạt động'
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const formContent = (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Tên người dùng" name="name" value={formData.name} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Vai trò</InputLabel>
            <Select label="Vai trò" name="role" value={formData.role} onChange={handleChange}>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Quản lý">Quản lý</MenuItem>
              <MenuItem value="Nhân viên">Nhân viên</MenuItem>
              <MenuItem value="Khách hàng">Khách hàng</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select label="Trạng thái" name="status" value={formData.status} onChange={handleChange}>
              <MenuItem value="Hoạt động">Hoạt động</MenuItem>
              <MenuItem value="Tạm ngưng">Tạm ngưng</MenuItem>
              <MenuItem value="Đã khóa">Đã khóa</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {item ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </Box>
    </>
  );

  return formContent;
};

// Form component cho xem chi tiết
const UserViewForm = ({ item, onClose }) => {
  if (!item) return null;

  const viewContent = (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Tên người dùng</Typography>
          <Typography variant="body1">{item.name}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Email</Typography>
          <Typography variant="body1">{item.email}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Số điện thoại</Typography>
          <Typography variant="body1">{item.phone}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Vai trò</Typography>
          <Typography variant="body1">{item.role}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Trạng thái</Typography>
          <Chip
            label={item.status}
            color={item.status === 'Hoạt động' ? 'success' : item.status === 'Tạm ngưng' ? 'warning' : 'error'}
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Ngày tạo</Typography>
          <Typography variant="body1">{new Date(item.createdAt).toLocaleString('vi-VN')}</Typography>
        </Grid>
        {item.details && (
          <>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Địa chỉ</Typography>
              <Typography variant="body1">{item.details.address}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Phòng ban</Typography>
              <Typography variant="body1">{item.details.department}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Ngày tham gia</Typography>
              <Typography variant="body1">{item.details.joinDate}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Đăng nhập gần nhất</Typography>
              <Typography variant="body1">{item.details.lastLogin}</Typography>
            </Grid>
          </>
        )}
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Đóng</Button>
      </Box>
    </>
  );

  return viewContent;
};

// Component lọc nâng cao
const AdvancedFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilter = () => {
    if (onFilter) {
      onFilter(filters);
    }
  };

  const handleReset = () => {
    setFilters({
      role: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    });
    if (onFilter) {
      onFilter({});
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Vai trò</InputLabel>
          <Select label="Vai trò" name="role" value={filters.role} onChange={handleChange}>
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Quản lý">Quản lý</MenuItem>
            <MenuItem value="Nhân viên">Nhân viên</MenuItem>
            <MenuItem value="Khách hàng">Khách hàng</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Trạng thái</InputLabel>
          <Select label="Trạng thái" name="status" value={filters.status} onChange={handleChange}>
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="Hoạt động">Hoạt động</MenuItem>
            <MenuItem value="Tạm ngưng">Tạm ngưng</MenuItem>
            <MenuItem value="Đã khóa">Đã khóa</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Từ ngày"
          type="date"
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Đến ngày"
          type="date"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={handleReset}>
            Đặt lại
          </Button>
          <Button variant="contained" onClick={handleFilter}>
            Lọc
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

// Component chính cho ví dụ
const ExampleUsage = () => {
  // State
  const [data, setData] = useState(generateMockData(50));
  const [filteredData, setFilteredData] = useState(data);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    totalItems: data.length
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  // Columns definition
  const columns = [
    {
      id: 'name',
      label: 'Tên người dùng',
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
      id: 'role',
      label: 'Vai trò',
      minWidth: 100
    },
    {
      id: 'status',
      label: 'Trạng thái',
      minWidth: 120,
      render: (value) => (
        <Chip label={value} color={value === 'Hoạt động' ? 'success' : value === 'Tạm ngưng' ? 'warning' : 'error'} size="small" />
      )
    },
    {
      id: 'createdAt',
      label: 'Ngày tạo',
      minWidth: 150,
      render: (value) => new Date(value).toLocaleString('vi-VN')
    }
  ];

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
    (term, filterValues) => {
      setLoading(true);

      // Giả lập thời gian tải
      setTimeout(() => {
        let filtered = [...data];

        // Tìm kiếm theo term
        if (term) {
          const lowerTerm = term.toLowerCase();
          filtered = filtered.filter(
            (item) =>
              item.name.toLowerCase().includes(lowerTerm) || item.email.toLowerCase().includes(lowerTerm) || item.phone.includes(term)
          );
        }

        // Lọc theo vai trò
        if (filterValues.role) {
          filtered = filtered.filter((item) => item.role === filterValues.role);
        }

        // Lọc theo trạng thái
        if (filterValues.status) {
          filtered = filtered.filter((item) => item.status === filterValues.status);
        }

        // Lọc theo ngày
        if (filterValues.dateFrom) {
          const fromDate = new Date(filterValues.dateFrom);
          filtered = filtered.filter((item) => new Date(item.createdAt) >= fromDate);
        }

        if (filterValues.dateTo) {
          const toDate = new Date(filterValues.dateTo);
          toDate.setHours(23, 59, 59, 999);
          filtered = filtered.filter((item) => new Date(item.createdAt) <= toDate);
        }

        setFilteredData(filtered);
        setPagination((prev) => ({
          ...prev,
          totalItems: filtered.length,
          page: 0 // Reset về trang đầu tiên khi lọc
        }));
        setLoading(false);
      }, 500);
    },
    [data]
  );

  const handleChangePage = useCallback((newPage) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage
    }));
  }, []);

  const handleChangeRowsPerPage = useCallback((newRowsPerPage) => {
    setPagination((prev) => ({
      ...prev,
      rowsPerPage: newRowsPerPage,
      page: 0
    }));
  }, []);

  const handleCreate = useCallback(
    (newUser) => {
      const newId = Math.max(...data.map((item) => item.id)) + 1;
      const newItem = {
        ...newUser,
        id: newId,
        createdAt: new Date().toISOString(),
        details: {
          address: 'Chưa cập nhật',
          department: 'Chưa phân bổ',
          joinDate: new Date().toLocaleDateString('vi-VN'),
          lastLogin: 'Chưa đăng nhập'
        }
      };

      const newData = [newItem, ...data];
      setData(newData);
      applyFilters(searchTerm, filters);
    },
    [data, searchTerm, filters]
  );

  const handleEdit = useCallback(
    (editedUser) => {
      const newData = data.map((item) => (item.id === editedUser.id ? { ...item, ...editedUser } : item));
      setData(newData);
      applyFilters(searchTerm, filters);
    },
    [data, searchTerm, filters]
  );

  const handleDelete = useCallback(
    (itemToDelete) => {
      let newData;

      if (Array.isArray(itemToDelete)) {
        // Xóa nhiều
        newData = data.filter((item) => !itemToDelete.includes(item.id));
      } else {
        // Xóa một
        newData = data.filter((item) => item.id !== itemToDelete.id);
      }

      setData(newData);
      applyFilters(searchTerm, filters);
    },
    [data, searchTerm, filters]
  );

  // Render collapse content
  const renderCollapse = useCallback((row) => {
    const { details } = row;

    return (
      <Box sx={{ py: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Thông tin chi tiết
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Địa chỉ:</Typography>
            <Typography variant="body2">{details.address}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Phòng ban:</Typography>
            <Typography variant="body2">{details.department}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Ngày tham gia:</Typography>
            <Typography variant="body2">{details.joinDate}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Đăng nhập gần nhất:</Typography>
            <Typography variant="body2">{details.lastLogin}</Typography>
          </Grid>
        </Grid>
      </Box>
    );
  }, []);

  // Render component
  return (
    <CustomDataPage
      title="Quản lý người dùng"
      data={filteredData}
      columns={columns}
      filterComponent={<AdvancedFilter onFilter={handleFilter} />}
      searchPlaceholder="Tìm kiếm theo tên, email, số điện thoại..."
      onSearch={handleSearch}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      permissions={{ create: true, edit: true, view: true, delete: true }}
      showCheckbox={true}
      actionType="icon-text"
      createComponent={(props) => <UserForm {...props} title="Thêm người dùng mới" onSubmit={handleCreate} />}
      editComponent={(props) => <UserForm {...props} title="Chỉnh sửa người dùng" onSubmit={handleEdit} />}
      viewComponent={(props) => <UserViewForm {...props} />}
      collapsible={true}
      renderCollapse={renderCollapse}
      loading={loading}
      pagination={pagination}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

export default ExampleUsage;
