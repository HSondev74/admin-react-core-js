import AdvancedFilter from '../../components/UI/AdvancedFilter';
import CustomSelectField from '../../components/UI/CustomSelectField';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Grid
} from '@mui/material';

const MenuAdvancedFilter = ({ availableRoles, onFilter }) => {
  return (
    <AdvancedFilter
      initialValues={{
        menuType: '',
        hasChildren: '',
        roles: []
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
                { label: 'Parent', value: 'Parent' },
                { label: 'Child', value: 'Child' },
                { label: 'Single', value: 'Single' }
              ]}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomSelectField
              label="Có menu con"
              name="hasChildren"
              value={filters.hasChildren}
              onChange={handleChange}
              options={[
                { label: 'Tất cả', value: '' },
                { label: 'Có', value: 'true' },
                { label: 'Không', value: 'false' }
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Quyền</InputLabel>
              <Select
                multiple
                name="roles"
                value={filters.roles}
                onChange={(e) => handleChange({ target: { name: 'roles', value: e.target.value } })}
                input={<OutlinedInput label="Quyền" />}
                renderValue={(selected) =>
                  selected
                    .map((roleId) => {
                      const role = availableRoles.find((r) => r.id === roleId);
                      return role?.name;
                    })
                    .join(', ')
                }
              >
                {availableRoles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    <Checkbox checked={filters.roles.includes(role.id)} />
                    <ListItemText primary={role.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </>
      )}
    </AdvancedFilter>
  );
};

export default MenuAdvancedFilter;