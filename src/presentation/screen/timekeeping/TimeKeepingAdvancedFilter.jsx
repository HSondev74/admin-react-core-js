import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Paper } from '@mui/material';

const TimeKeepingAdvancedFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    workDateFrom: '',
    workDateTo: '',
    period: '',
    checkType: '',
    status: '',
    source: '',
    deviceCode: ''
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
      workDateFrom: '',
      workDateTo: '',
      period: '',
      checkType: '',
      status: '',
      source: '',
      deviceCode: ''
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  }, [onFilter]);

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Date range */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Từ ngày"
            type="date"
            value={filters.workDateFrom}
            onChange={(e) => handleFilterChange('workDateFrom', e.target.value)}
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
            value={filters.workDateTo}
            onChange={(e) => handleFilterChange('workDateTo', e.target.value)}
            size="small"
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>

        {/* Period filter */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Ca làm việc"
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
            size="small"
            placeholder="Nhập ca làm việc..."
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

        {/* Status filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Trạng thái</InputLabel>
            <Select value={filters.status} label="Trạng thái" onChange={(e) => handleFilterChange('status', e.target.value)}>
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="LATE">Muộn</MenuItem>
              <MenuItem value="EARLY">Sớm</MenuItem>
              <MenuItem value="ON_TIME">Đúng giờ</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Source filter */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Nguồn"
            value={filters.source}
            onChange={(e) => handleFilterChange('source', e.target.value)}
            size="small"
            placeholder="Nhập nguồn..."
          />
        </Grid>

        {/* Device code filter */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Mã thiết bị"
            value={filters.deviceCode}
            onChange={(e) => handleFilterChange('deviceCode', e.target.value)}
            size="small"
            placeholder="Nhập mã thiết bị..."
          />
        </Grid>

        {/* Action buttons */}
        <Grid item xs={12} sm={6} md={2}>
          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
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
