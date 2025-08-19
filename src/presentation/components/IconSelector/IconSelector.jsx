import { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment, Grid, IconButton, Popover, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { formStyles, formViewStyles } from '../../assets/styles/formStyles';

const IconSelector = ({ label, value, onChange, disabled, error, isView }) => {
  const [icons, setIcons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIcons, setFilteredIcons] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const loadIcons = async () => {
      try {
        const response = await fetch('http://localhost:3000/mts/icons.json');
        const iconData = await response.json();
        setIcons(iconData);
        setFilteredIcons(iconData);
      } catch (error) {
        console.error('Error loading icons:', error);
      }
    };
    loadIcons();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredIcons(icons);
    } else {
      setFilteredIcons(icons.filter((icon) => icon.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }
  }, [searchTerm, icons]);

  const renderIcon = (svgString) => {
    return (
      <Box
        sx={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
    );
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
  const selectedIcon = icons.find((icon) => icon.name === value);

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
          startAdornment: selectedIcon ? <InputAdornment position="start">{renderIcon(selectedIcon.svg)}</InputAdornment> : null
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
              {filteredIcons.slice(0, 200).map((icon) => (
                <Grid item key={icon.name}>
                  <IconButton
                    onClick={() => handleIconSelect(icon.name)}
                    sx={{
                      width: 36,
                      height: 36,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      bgcolor: value === icon.name ? 'primary.light' : 'transparent',
                      '&:hover': {
                        bgcolor: 'primary.light'
                      }
                    }}
                  >
                    {renderIcon(icon.svg)}
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
