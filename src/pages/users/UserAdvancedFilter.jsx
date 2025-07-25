// Container Component
import AdvancedFilter from '../../components/ui/AdvancedFilter';
import CustomSelectField from '../../components/ui/CustomSelectField';
import CustomInputField from '../../components/ui/CustomInputField';

// Material UI components
import Grid from '@mui/material/Grid';

const UserAdvancedFilter = ({ onFilter }) => {
  return (
    <AdvancedFilter
      initialValues={{
        role: '',
        status: '',
        dateFrom: '',
        dateTo: ''
      }}
      onFilter={onFilter}
    >
      {(filters, handleChange) => (
        <>
          <Grid item xs={12} md={3}>
            <CustomSelectField
              label="Vai trò"
              name="role"
              value={filters.role}
              onChange={handleChange}
              options={[
                { label: 'Tất cả', value: '' },
                { label: 'Admin', value: 'Admin' },
                { label: 'Quản lý', value: 'Quản lý' },
                { label: 'Nhân viên', value: 'Nhân viên' },
                { label: 'Khách hàng', value: 'Khách hàng' }
              ]}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomSelectField
              label="Trạng thái"
              name="status"
              value={filters.status}
              onChange={handleChange}
              options={[
                { label: 'Tất cả', value: '' },
                { label: 'Hoạt động', value: 'Hoạt động' },
                { label: 'Tạm ngưng', value: 'Tạm ngưng' },
                { label: 'Đã khóa', value: 'Đã khóa' }
              ]}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomInputField label="Từ ngày" name="dateFrom" type="date" value={filters.dateFrom} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomInputField label="Đến ngày" name="dateTo" type="date" value={filters.dateTo} onChange={handleChange} />
          </Grid>
        </>
      )}
    </AdvancedFilter>
  );
};

export default UserAdvancedFilter;
