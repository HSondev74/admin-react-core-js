import { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment, Grid, IconButton, Popover, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { formStyles, formViewStyles } from '../../assets/styles/formStyles';
import * as AntIcons from '@ant-design/icons';

const IconSelector = ({ label, value, onChange, disabled, error, isView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Get all Ant Design icon names
  const iconNames = Object.keys(AntIcons).filter(name => name.endsWith('Outlined'));
  
  const filteredIcons = searchTerm 
    ? iconNames.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
    : iconNames;

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

  const handleIconSelect = (iconName) => {
    onChange(iconName);
    handleClose();
  };

  const open = Boolean(anchorEl);
  // Convert value to Ant Design icon name format
  const getAntIconName = (iconValue) => {
    if (!iconValue) return null;
    const cleanName = iconValue.replace(/^fa-/, '');
    const pascalCase = cleanName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    return pascalCase.endsWith('Outlined') ? pascalCase : `${pascalCase}Outlined`;
  };
  
  const selectedIconName = getAntIconName(value);

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
        inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
        InputProps={{
          startAdornment: selectedIconName ? <InputAdornment position="start">{renderIcon(selectedIconName)}</InputAdornment> : null
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
              {filteredIcons.slice(0, 200).map((iconName) => {
                // Convert Ant icon name back to simple format for storage
                const simpleIconName = iconName.replace('Outlined', '').toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '');
                return (
                  <Grid item key={iconName}>
                    <IconButton
                      onClick={() => handleIconSelect(simpleIconName)}
                      sx={{
                        width: 36,
                        height: 36,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        bgcolor: selectedIconName === iconName ? 'primary.light' : 'transparent',
                        '&:hover': {
                          bgcolor: 'primary.light'
                        }
                      }}
                    >
                      {renderIcon(iconName)}
                    </IconButton>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Paper>
      </Popover>
    </>
  );
};

export default IconSelector;
