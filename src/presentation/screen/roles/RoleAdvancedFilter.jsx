// Container Component
import AdvancedFilter from '../../components/UI/AdvancedFilter';
import CustomSelectField from '../../components/UI/CustomSelectField';

// Material UI components
import Grid from '@mui/material/Grid';

const RoleAdvancedFilter = ({ onFilter }) => {
  return (
    <AdvancedFilter
      initialValues={{
        sortBy: '',
        sortDirection: ''
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
                { label: 'Mã chức vụ', value: 'code' },
                { label: 'Tên chức vụ', value: 'name' },
                { label: 'Mô tả', value: 'description' },
                { label: 'Ngày tạo', value: 'createTime' },
                { label: 'Ngày cập nhật', value: 'updateTime' }
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
                { label: 'Tăng dần', value: 'asc' },
                { label: 'Giảm dần', value: 'desc' }
              ]}
            />
          </Grid>
        </>
      )}
    </AdvancedFilter>
  );
};

export default RoleAdvancedFilter;
