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
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons';

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
  onDelete
}) => {
  // State
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const [page, setPage] = useState(pagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(pagination.rowsPerPage);

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

  // Handlers
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
      if (onChangePage) {
        onChangePage(newPage);
      }
    },
    [onChangePage]
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(newRowsPerPage);
      setPage(0);
      if (onChangeRowsPerPage) {
        onChangeRowsPerPage(newRowsPerPage);
      }
    },
    [onChangeRowsPerPage]
  );

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
    (item) => {
      const actions = [];

      if (permissions.view) {
        if (actionType === 'icon') {
          actions.push(
            <Tooltip key="view" title="Xem">
              <IconButton color="info" size="small" onClick={() => handleView(item)}>
                <EyeOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        } else if (actionType === 'text') {
          actions.push(
            <Button key="view" color="info" size="small" onClick={() => handleView(item)}>
              Xem
            </Button>
          );
        } else {
          actions.push(
            <Button key="view" color="info" size="small" startIcon={<EyeOutlined />} onClick={() => handleView(item)}>
              Xem
            </Button>
          );
        }
      }

      if (permissions.edit) {
        if (actionType === 'icon') {
          actions.push(
            <Tooltip key="edit" title="Sửa">
              <IconButton color="primary" size="small" onClick={() => handleEdit(item)}>
                <EditOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        } else if (actionType === 'text') {
          actions.push(
            <Button key="edit" color="primary" size="small" onClick={() => handleEdit(item)}>
              Sửa
            </Button>
          );
        } else {
          actions.push(
            <Button key="edit" color="primary" size="small" startIcon={<EditOutlined />} onClick={() => handleEdit(item)}>
              Sửa
            </Button>
          );
        }
      }

      if (permissions.delete) {
        if (actionType === 'icon') {
          actions.push(
            <Tooltip key="delete" title="Xóa">
              <IconButton color="error" size="small" onClick={() => handleDelete(item)}>
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        } else if (actionType === 'text') {
          actions.push(
            <Button key="delete" color="error" size="small" onClick={() => handleDelete(item)}>
              Xóa
            </Button>
          );
        } else {
          actions.push(
            <Button key="delete" color="error" size="small" startIcon={<DeleteOutlined />} onClick={() => handleDelete(item)}>
              Xóa
            </Button>
          );
        }
      }

      return <Box sx={{ display: 'flex', gap: 1 }}>{actions}</Box>;
    },
    [actionType, permissions, handleView, handleEdit, handleDelete]
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
        <Table stickyHeader aria-label="customized table" size="small">
          <TableHead>
            <TableRow>
              {/* Expand column for collapsible rows */}
              {collapsible && (
                <TableCell
                  padding="checkbox"
                  style={{
                    backgroundColor: '#f5f5f5',
                    position: 'sticky',
                    left: 0,
                    zIndex: 3
                  }}
                />
              )}

              {/* Checkbox column */}
              {showCheckbox && (
                <TableCell
                  padding="checkbox"
                  style={{
                    backgroundColor: '#f5f5f5',
                    position: 'sticky',
                    left: collapsible ? 40 : 0,
                    zIndex: 3
                  }}
                >
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

              {/* Data columns */}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="center"
                  style={{
                    minWidth: column.minWidth,
                    width: column.width,
                    backgroundColor: '#f5f5f5',
                    fontWeight: 'bold',
                    position: 'sticky',
                    left: 0,
                    zIndex: 3
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

              {/* Actions column */}
              {(permissions.edit || permissions.view || permissions.delete) && (
                <TableCell
                  align="center"
                  style={{
                    minWidth: 150,
                    position: 'sticky',
                    right: 0,
                    backgroundColor: '#f5f5f5',
                    fontWeight: 'bold',
                    zIndex: 2
                  }}
                >
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
                      {/* Expand/collapse button */}
                      {collapsible && (
                        <TableCell
                          padding="checkbox"
                          style={{
                            position: 'sticky',
                            left: 0,
                            backgroundColor: 'inherit',
                            zIndex: 1
                          }}
                        >
                          <IconButton aria-label="expand row" size="small" onClick={() => toggleRowExpand(row.id)}>
                            {isExpanded ? <ArrowDownOutlined /> : <ArrowRightOutlined />}
                          </IconButton>
                        </TableCell>
                      )}

                      {/* Checkbox */}
                      {showCheckbox && (
                        <TableCell
                          padding="checkbox"
                          style={{
                            position: 'sticky',
                            left: collapsible ? 40 : 0,
                            backgroundColor: isItemSelected ? 'rgba(25, 118, 210, 0.08)' : 'white',
                            zIndex: 1
                          }}
                        >
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

                      {/* Data cells */}
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align || 'center'}>
                            {column.render ? column.render(value, row) : value}
                          </TableCell>
                        );
                      })}

                      {/* Actions */}
                      {(permissions.edit || permissions.view || permissions.delete) && (
                        <TableCell
                          align="center"
                          style={{
                            position: 'sticky',
                            right: 0,
                            backgroundColor: 'white',
                            boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 12px',
                            zIndex: 1
                          }}
                        >
                          {renderActionButtons(row)}
                        </TableCell>
                      )}
                    </TableRow>

                    {/* Collapsible content */}
                    {collapsible && (
                      <TableRow>
                        <TableCell
                          colSpan={
                            columns.length +
                            (showCheckbox ? 1 : 0) +
                            1 + // Expand column
                            (permissions.edit || permissions.view || permissions.delete ? 1 : 0)
                          }
                          style={{ paddingBottom: 0, paddingTop: 0, border: 0 }}
                        >
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 2 }}>{renderCollapse && renderCollapse(row)}</Box>
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

      {/* Pagination */}
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
  onDelete: PropTypes.func
};

export default CustomDataTable;
