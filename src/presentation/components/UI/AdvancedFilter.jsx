import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const AdvancedFilter = ({ initialValues, onFilter, children }) => {
  const [filters, setFilters] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFilters(initialValues);
    if (onFilter) onFilter({});
  };

  const handleApplyFilter = () => {
    if (onFilter) onFilter(filters);
  };

  return (
    <Grid container spacing={2}>
      {children(filters, handleChange)}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={handleReset}>
            Đặt lại
          </Button>
          <Button variant="contained" onClick={handleApplyFilter}>
            Lọc
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AdvancedFilter;
