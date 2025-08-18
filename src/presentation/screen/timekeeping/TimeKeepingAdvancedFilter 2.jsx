import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, FormControlLabel, Switch, Paper } from '@mui/material';

const TimeKeepingAdvancedFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    showLateOnly: false,
    showEarlyOnly: false,
    departmentName: '',
    checkType: '',
    dateFrom: '',
    dateTo: ''
  });

  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleApplyFilter = useCallback(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  const handleResetFilter = useCallback(() => {
    const resetFilters = {
      showLateOnly: false,
      showEarlyOnly: false,
      departmentName: '',
      checkType: '',
      dateFrom: '',
      dateTo: ''
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  }, [onFilter]);

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Quick filters */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControlLabel
            control={
              <Switch checked={filters.showLateOnly} onChange={(e) => handleFilterChange('showLateOnly', e.target.checked)} color="error" />
            }
            label="Chỉ hiển thị người muộn"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControlLabel
            control={
              <Switch
                checked={filters.showEarlyOnly}
                onChange={(e) => handleFilterChange('showEarlyOnly', e.target.checked)}
                color="warning"
              />
            }
            label="Chỉ hiển thị người sớm"
          />
        </Grid>

        {/* Department filter */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Phòng ban"
            value={filters.departmentName}
            onChange={(e) => handleFilterChange('departmentName', e.target.value)}
            size="small"
          />
        </Grid>

        {/* Check type filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Loại chấm công</InputLabel>
            <Select value={filters.checkType} label="Loại chấm công" onChange={(e) => handleFilterChange('checkType', e.target.value)}>
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="CHECK_IN">Vào</MenuItem>
              <MenuItem value="CHECK_OUT">Ra</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Date range */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Từ ngày"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            size="small"
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Đến ngày"
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            size="small"
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>

        {/* Action buttons */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleApplyFilter} size="small" fullWidth>
              Áp dụng
            </Button>
            <Button variant="outlined" onClick={handleResetFilter} size="small" fullWidth>
              Đặt lại
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

TimeKeepingAdvancedFilter.propTypes = {
  onFilter: PropTypes.func.isRequired
};

export default TimeKeepingAdvancedFilter;
