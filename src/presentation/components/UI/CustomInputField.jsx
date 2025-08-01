import React from 'react';
import TextField from '@mui/material/TextField';

const CustomInputField = ({ label, name, value, onChange, type = 'text', size = 'small', ...rest }) => {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      size={size}
      InputLabelProps={type === 'date' ? { shrink: true } : undefined}
      {...rest}
    />
  );
};

export default CustomInputField;
