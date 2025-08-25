import { useState } from 'react';
import { Box, TextField, InputAdornment, Grid, IconButton, Popover, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { formStyles, formViewStyles } from '../../assets/styles/formStyles';
import * as AntIcons from '@ant-design/icons';

const IconSelector = ({ label, value, onChange, disabled, error, isView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  // Lấy tất cả icon Ant Design có hậu tố Outlined
  const iconNames = Object.keys(AntIcons).filter((name) => name.endsWith('Outlined'));

  const filteredIcons = searchTerm ? iconNames.filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase())) : iconNames;

  // Render 1 icon theo tên
  const renderIcon = (iconName) => {
    const IconComponent = AntIcons[iconName];
    return IconComponent ? <IconComponent style={{ fontSize: 20 }} /> : null;
  };

  const handleClick = (event) => {
    if (!disabled && !isView) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchTerm('');
  };

  // Khi chọn icon thì lưu đúng tên PascalCase (vd: HomeOutlined)
  const handleIconSelect = (iconName) => {
    onChange(iconName); // <-- lưu iconName gốc
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <TextField
        fullWidth
        label={label}
        value={value || ''}
        onClick={handleClick}
        readOnly
        disabled={disabled}
        error={error}
        placeholder="Chọn icon..."
        InputLabelProps={{ style: formStyles.label }}
        inputProps={{
          style: isView ? formViewStyles.inputReadOnly : formStyles.input,
          readOnly: isView
        }}
        InputProps={{
          startAdornment: value ? <InputAdornment position="start">{renderIcon(value)}</InputAdornment> : null
        }}
        sx={{ cursor: disabled || isView ? 'default' : 'pointer' }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Paper sx={{ width: 500, maxHeight: 500, p: 2 }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm icon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ width: '100%', mb: 2 }}
          />

          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            <Grid container spacing={0.5}>
              <Grid item>
                <IconButton
                  onClick={() => handleIconSelect('')}
                  sx={{
                    width: 36,
                    height: 36,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    bgcolor: !value ? 'primary.light' : 'transparent',
                    '&:hover': {
                      bgcolor: 'primary.light'
                    }
                  }}
                >
                  ✕
                </IconButton>
              </Grid>
              {filteredIcons.slice(0, 200).map((iconName) => (
                <Grid item key={iconName}>
                  <IconButton
                    onClick={() => handleIconSelect(iconName)} // lưu iconName gốc luôn
                    sx={{
                      width: 36,
                      height: 36,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      bgcolor: value === iconName ? 'primary.light' : 'transparent',
                      '&:hover': {
                        bgcolor: 'primary.light'
                      }
                    }}
                  >
                    {renderIcon(iconName)}
                  </IconButton>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Popover>
    </>
  );
};

export default IconSelector;
