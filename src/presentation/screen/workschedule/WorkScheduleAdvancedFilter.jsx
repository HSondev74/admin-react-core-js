// Container Component
import AdvancedFilter from '../../components/UI/AdvancedFilter';
import CustomSelectField from '../../components/UI/CustomSelectField';

// Material UI components
import Grid from '@mui/material/Grid';

const WorkScheduleAdvancedFilter = ({ onFilter }) => {
  return (
    <AdvancedFilter
      initialValues={{
        sortBy: '',
        sortDirection: '',
        isActive: '',
        isDefault: ''
      }}
      onFilter={onFilter}
    >
      {(filters, handleChange) => (
        <>
          <Grid item xs={12} md={6}>
            <CustomSelectField
              label="Sắp xếp theo"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleChange}
              options={[
                { label: 'Không sắp xếp', value: '' },
                { label: 'Tên lịch làm việc', value: 'name' },
                { label: 'Múi giờ', value: 'timezone' },
                { label: 'Giờ làm tối thiểu', value: 'minimumWorkHours' },
                { label: 'Thời gian nghỉ trưa', value: 'maxLunchBreakMinutes' }
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomSelectField
              label="Thứ tự"
              name="sortDirection"
              value={filters.sortDirection}
              onChange={handleChange}
              options={[
                { label: 'Mặc định', value: '' },
                { label: 'Tăng dần', value: 'ASC' },
                { label: 'Giảm dần', value: 'DESC' }
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomSelectField
              label="Trạng thái hoạt động"
              name="isActive"
              value={filters.isActive}
              onChange={handleChange}
              options={[
                { label: 'Tất cả', value: '' },
                { label: 'Đang hoạt động', value: 'true' },
                { label: 'Không hoạt động', value: 'false' }
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomSelectField
              label="Lịch mặc định"
              name="isDefault"
              value={filters.isDefault}
              onChange={handleChange}
              options={[
                { label: 'Tất cả', value: '' },
                { label: 'Lịch mặc định', value: 'true' },
                { label: 'Lịch thường', value: 'false' }
              ]}
            />
          </Grid>
        </>
      )}
    </AdvancedFilter>
  );
};

export default WorkScheduleAdvancedFilter;
