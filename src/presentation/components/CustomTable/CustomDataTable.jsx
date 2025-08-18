import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
// Material UI components
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { Menu, MenuItem } from '@mui/material';
//antd icon
import { ArrowDownOutlined, ArrowRightOutlined, DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
// style
import { tableStyles } from '../../assets/styles/tableStyles';

/**
 * Bảng dữ liệu tùy chỉnh với khả năng sắp xếp, phân trang, chọn nhiều, và các hành động
 */
const CustomDataTable = ({
  data = [],
  columns = [],
  loading = false,
  showCheckbox = true,
  actionType = 'icon-text', // 'icon', 'text', 'icon-text'
  permissions = { edit: true, view: true, delete: true },
  collapsible = false,
  renderCollapse,
  pagination = { page: 0, rowsPerPage: 10, totalItems: 0 },
  onChangePage,
  onChangeRowsPerPage,
  onSelectionChange,
  onEdit,
  onView,
  onDelete,
  enablePagination = true,
  selected,
  setSelected
}) => {
  // State
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const [page, setPage] = useState(pagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(pagination.rowsPerPage);

  //anchor
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const open = Boolean(anchorEl);

  // Effect to sync pagination state with props
  useEffect(() => {
    setPage(pagination.page);
    setRowsPerPage(pagination.rowsPerPage);
  }, [pagination.page, pagination.rowsPerPage]);

  // Effect to notify parent component about selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selected);
    }
  }, [selected, onSelectionChange]);

  // ui handlers

  const handleClickMenu = useCallback((event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
    setSelectedItem(null);
  }, []);

  // api Handlers
  const handleRequestSort = useCallback(
    (property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    },
    [order, orderBy]
  );

  const handleSelectAllClick = useCallback(
    (event) => {
      if (event.target.checked) {
        const newSelected = data.map((n) => n.id);
        setSelected(newSelected);
      } else {
        setSelected([]);
      }
    },
    [data]
  );

  const handleClick = useCallback(
    (event, id) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = [...selected, id];
      } else if (selectedIndex === 0) {
        newSelected = [...selected.slice(1)];
      } else if (selectedIndex === selected.length - 1) {
        newSelected = [...selected.slice(0, -1)];
      } else if (selectedIndex > 0) {
        newSelected = [...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)];
      }

      setSelected(newSelected);
    },
    [selected]
  );

  const handleChangePage = useCallback(
    (event, newPage) => {
      setPage(newPage);
      if (enablePagination && onChangePage) {
        // Kiểm tra enablePagination
        onChangePage(newPage);
      }
    },
    [onChangePage, enablePagination]
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(newRowsPerPage);
      setPage(0);
      if (enablePagination && onChangeRowsPerPage) {
        // Kiểm tra enablePagination
        onChangeRowsPerPage(newRowsPerPage);
      }
    },
    [onChangeRowsPerPage, enablePagination]
  );

  // Chỉ chuyển sự kiện edit lên component cha
  const handleEdit = useCallback(
    (item) => {
      if (onEdit) {
        onEdit(item);
      }
    },
    [onEdit]
  );

  const handleView = useCallback(
    (item) => {
      if (onView) {
        onView(item);
      }
    },
    [onView]
  );

  const handleDelete = useCallback(
    (item) => {
      if (onDelete) {
        onDelete(item);
        setSelected([]);
      }
    },
    [onDelete]
  );

  const toggleRowExpand = useCallback((id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Render action buttons for each row
  const renderActionButtons = useCallback(
    (item) => (
      <Box sx={tableStyles.actionButtonStyle}>
        <IconButton
          aria-label="more actions"
          aria-controls={open ? 'actions-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={(event) => handleClickMenu(event, item)}
          size="small"
          sx={tableStyles.actionIconButton}
        >
          <MoreOutlined />
        </IconButton>
        <Menu
          id="actions-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
        >
          {permissions.view && (
            <MenuItem
              onClick={() => {
                handleView(selectedItem);
                handleCloseMenu();
              }}
              sx={{ color: 'green' }}
            >
              <EyeOutlined style={tableStyles.menuItemIcon} /> Xem
            </MenuItem>
          )}
          {permissions.edit && (
            <MenuItem
              onClick={() => {
                handleEdit(selectedItem);
                handleCloseMenu();
              }}
              sx={{ color: 'blue' }}
            >
              <EditOutlined style={tableStyles.menuItemIcon} /> Sửa
            </MenuItem>
          )}
          {permissions.delete && (
            <MenuItem
              onClick={() => {
                handleDelete(selectedItem);
                handleCloseMenu();
              }}
              sx={{ color: 'red' }}
            >
              <DeleteOutlined style={tableStyles.menuItemIcon} /> Xóa
            </MenuItem>
          )}
        </Menu>
      </Box>
    ),
    [open, anchorEl, selectedItem, permissions, handleView, handleEdit, handleDelete, handleClickMenu, handleCloseMenu]
  );

  return (
    <Paper sx={tableStyles.paper}>
      <TableContainer sx={tableStyles.tableContainer}>
        <Table aria-label="customized table" size="small">
          <TableHead sx={tableStyles.tableHeadSticky}>
            <TableRow>
              {collapsible && <TableCell sx={tableStyles.tableHeadCellExpand} />}
              {showCheckbox && (
                <TableCell padding="checkbox" style={tableStyles.tableHeadCellCheckbox}>
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < data.length}
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={handleSelectAllClick}
                    inputProps={{
                      'aria-label': 'select all'
                    }}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'center'}
                  sx={{
                    ...tableStyles.tableHeadCellData,
                    minWidth: tableStyles.tableHeadCellData.minWidth(column),
                    width: tableStyles.tableHeadCellData.width(column)
                  }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {(permissions.edit || permissions.view || permissions.delete) && (
                <TableCell align="center" sx={tableStyles.tableHeadCellActions}>
                  Thao tác
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (showCheckbox ? 1 : 0) +
                    (collapsible ? 1 : 0) +
                    (permissions.edit || permissions.view || permissions.delete ? 1 : 0)
                  }
                  align="center"
                >
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Đang tải dữ liệu...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (showCheckbox ? 1 : 0) +
                    (collapsible ? 1 : 0) +
                    (permissions.edit || permissions.view || permissions.delete ? 1 : 0)
                  }
                  align="center"
                >
                  <Typography variant="body2">Không có dữ liệu</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const isItemSelected = isSelected(row.id);
                const isExpanded = expandedRows[row.id] || false;

                return (
                  <>
                    <TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={row.id} selected={isItemSelected}>
                      {collapsible && (
                        <TableCell sx={tableStyles.tableBodyCellExpand}>
                          <IconButton aria-label="expand row" size="small" onClick={() => toggleRowExpand(row.id)}>
                            {isExpanded ? <ArrowDownOutlined /> : <ArrowRightOutlined />}
                          </IconButton>
                        </TableCell>
                      )}
                      {showCheckbox && (
                        <TableCell sx={tableStyles.tableBodyCellCheckbox(isItemSelected, collapsible)}>
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onClick={(event) => handleClick(event, row.id)}
                            inputProps={{
                              'aria-labelledby': `enhanced-table-checkbox-${row.id}`
                            }}
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align || 'center'} sx={{ py: column.padding || 1 }}>
                            {column.render ? column.render(value, row) : value}
                          </TableCell>
                        );
                      })}
                      {(permissions.edit || permissions.view || permissions.delete) && (
                        <TableCell sx={tableStyles.tableBodyCellActions}>{renderActionButtons(row)}</TableCell>
                      )}
                    </TableRow>
                    {collapsible && (
                      <TableRow>
                        <TableCell
                          sx={tableStyles.collapsibleRow}
                          colSpan={
                            columns.length +
                            (showCheckbox ? 1 : 0) +
                            1 + // Expand column
                            (permissions.edit || permissions.view || permissions.delete ? 1 : 0)
                          }
                        >
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={tableStyles.collapsibleBox}>{renderCollapse && renderCollapse(row)}</Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination feature */}
      {enablePagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={pagination.totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      )}
    </Paper>
  );
};

CustomDataTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      minWidth: PropTypes.number,
      width: PropTypes.number,
      align: PropTypes.oneOf(['left', 'right', 'center']),
      sortable: PropTypes.bool,
      render: PropTypes.func
    })
  ),
  loading: PropTypes.bool,
  showCheckbox: PropTypes.bool,
  actionType: PropTypes.oneOf(['icon', 'text', 'icon-text']),
  permissions: PropTypes.shape({
    edit: PropTypes.bool,
    view: PropTypes.bool,
    delete: PropTypes.bool
  }),
  collapsible: PropTypes.bool,
  renderCollapse: PropTypes.func,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    totalItems: PropTypes.number
  }),
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  onSelectionChange: PropTypes.func,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
  onDelete: PropTypes.func,
  enablePagination: PropTypes.bool,
  selected: PropTypes.array,
  setSelected: PropTypes.func
};

export default CustomDataTable;
