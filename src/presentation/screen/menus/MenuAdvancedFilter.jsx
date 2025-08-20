import AdvancedFilter from '../../components/UI/AdvancedFilter';
import CustomSelectField from '../../components/UI/CustomSelectField';
import { Grid } from '@mui/material';

const MenuAdvancedFilter = ({ availableRoles, onFilter }) => {
  return (
    <AdvancedFilter
      initialValues={{
        menuType: '',
        parentId: ''
      }}
      onFilter={onFilter}
    >
      {(filters, handleChange) => (
        <>
          <Grid item xs={12} md={3}>
            <CustomSelectField
              label="Loại Menu"
              name="menuType"
              value={filters.menuType}
              onChange={handleChange}
              options={[
                { label: 'Tất cả', value: '' },
                { label: 'Danh sách', value: 'MENU' },
                { label: 'Nút', value: 'BUTTON' }
              ]}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomSelectField
              label="Menu cha"
              name="parentId"
              value={filters.parentId}
              onChange={handleChange}
              options={[
                { label: 'Tất cả', value: '' },
                { label: 'Menu gốc', value: 'null' }
              ]}
            />
          </Grid>
        </>
      )}
    </AdvancedFilter>
  );
};

export default MenuAdvancedFilter;
