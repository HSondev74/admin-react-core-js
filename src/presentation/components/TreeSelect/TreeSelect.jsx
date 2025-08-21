import { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Box,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  IconButton,
  Popover,
  Typography
} from '@mui/material';
import { ExpandLess, ExpandMore, Search, ArrowDropDown } from '@mui/icons-material';

// Styles
import { formStyles, formViewStyles } from '../../assets/styles/formStyles';

// Icon
import { DownOutlined, RightOutlined } from '@ant-design/icons';

const TreeSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Chọn danh sách...',
  searchPlaceholder = 'Tìm kiếm...',
  error,
  disabled,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState(options);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (searchTerm) {
      const filterTree = (items) => {
        return items
          .filter((item) => {
            const matchesSearch = item.item?.name?.toLowerCase().includes(searchTerm.toLowerCase());
            const hasMatchingChildren = item.children && filterTree(item.children).length > 0;

            if (matchesSearch || hasMatchingChildren) {
              return {
                ...item,
                children: hasMatchingChildren ? filterTree(item.children) : item.children
              };
            }
            return false;
          })
          .filter(Boolean);
      };
      setFilteredOptions(filterTree(options));
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchTerm('');
  };

  const handleToggleExpand = (itemId) => {
    setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
  };

  const handleSelect = (item) => {
    onChange(item);
    handleClose();
  };

  const getSelectedLabel = () => {
    if (!value) return '';

    const findItem = (items, id) => {
      for (const item of items) {
        const itemId = item.item?.id || item.id;
        if (itemId === id) return item;
        if (item.children) {
          const found = findItem(item.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const selectedItem = findItem(options, value);
    return selectedItem?.item?.name || selectedItem?.name || '';
  };

  const renderTreeItems = (items, level = 0) => {
    return items.map((item) => {
      const itemId = item.item?.id || item.id;
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems.includes(itemId);

      return (
        <Box key={itemId}>
          <ListItem disablePadding sx={{ pl: level * 3 }}>
            <ListItemButton
              onClick={() => handleSelect(itemId)}
              sx={{
                py: 2,
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
              }}
            >
              {hasChildren && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleExpand(itemId);
                  }}
                  sx={{ mr: 1, p: 0.25 }}
                  disableRipple
                >
                  {isExpanded ? <DownOutlined /> : <RightOutlined />}
                </IconButton>
              )}
              {!hasChildren && <Box sx={{ width: 32 }} />}
              <ListItemText
                primary={item.item?.name || item.name}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                    fontWeight: level === 0 ? 600 : 400
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
          {hasChildren && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              {renderTreeItems(item.children, level + 1)}
            </Collapse>
          )}
        </Box>
      );
    });
  };

  return (
    <>
      <FormControl fullWidth error={error} {...props}>
        <InputLabel style={formStyles.label}>{label}</InputLabel>
        <OutlinedInput
          label={label}
          value={getSelectedLabel()}
          onClick={handleClick}
          readOnly
          placeholder={placeholder}
          disabled={disabled}
          inputProps={{
            style: disabled ? formViewStyles.inputReadOnly : formStyles.input
          }}
          endAdornment={
            <ArrowDropDown
              sx={{
                color: disabled ? 'rgba(0, 0, 0, 0.26)' : 'rgba(0, 0, 0, 0.54)',
                pointerEvents: 'none'
              }}
            />
          }
          sx={{ cursor: disabled ? 'default' : 'pointer' }}
        />
      </FormControl>

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
        PaperProps={{
          sx: {
            width: anchorEl?.offsetWidth || 300,
            maxHeight: 400,
            mt: 1
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <TextField
            fullWidth
            size="small"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Box>

        <List sx={{ py: 0, maxHeight: 300, overflow: 'auto' }}>
          {filteredOptions.length > 0 ? (
            renderTreeItems(filteredOptions)
          ) : (
            <ListItem>
              <ListItemText primary="Không tìm thấy kết quả" sx={{ textAlign: 'center', color: 'text.secondary' }} />
            </ListItem>
          )}
        </List>
      </Popover>
    </>
  );
};

export default TreeSelect;
