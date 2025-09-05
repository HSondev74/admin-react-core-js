import PropTypes from 'prop-types';
import AdvancedFilter from '../../components/UI/AdvancedFilter';
import CustomSelectField from '../../components/UI/CustomSelectField';
import { Grid, TextField } from '@mui/material';

const DepartmentAdvancedFilter = ({ onFilter, departmentCodes = [] }) => {
  // Extract unique department codes for dropdown
  const extractCodes = (items) => {
    let codes = [];
    items.forEach((item) => {
      if (item.item?.code) {
        codes.push({ label: item.item.code, value: item.item.code });
      }
      if (item.children && item.children.length > 0) {
        codes = codes.concat(extractCodes(item.children));
      }
    });
    return codes;
  };

  const codeOptions = [{ label: 'Tất cả', value: '' }, ...extractCodes(departmentCodes)];
  return (
    <AdvancedFilter
      initialValues={{
        name: '',
        code: '',
        lockFlag: '',
        createdFrom: '',
        createdTo: ''
      }}
      onFilter={onFilter}
    >
      {(filters, handleChange) => (
        <>
          <Grid item xs={12} md={3}>
            <CustomSelectField
              label="Trạng thái"
              name="lockFlag"
              value={filters.lockFlag}
              onChange={handleChange}
              options={[
                { label: 'Tất cả', value: '' },
                { label: 'Hoạt động', value: '0' },
                { label: 'Khóa', value: '9' }
              ]}
            />
          </Grid>
        </>
      )}
    </AdvancedFilter>
  );
};

DepartmentAdvancedFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
  departmentCodes: PropTypes.array
};

export default DepartmentAdvancedFilter;
