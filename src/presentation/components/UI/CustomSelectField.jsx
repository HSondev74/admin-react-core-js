import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';

const CustomSelectField = ({ label, name, value, onChange, options, multiple = false, MenuProps }) => {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        multiple={multiple}
        input={multiple ? <OutlinedInput label={label} /> : undefined}
        renderValue={multiple ? (selected) => selected.map((val) => options.find((opt) => opt.value === val)?.label).join(', ') : undefined}
        MenuProps={MenuProps}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {multiple && <Checkbox checked={value.includes(opt.value)} />}
            <ListItemText primary={opt.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelectField;
