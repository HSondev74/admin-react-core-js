import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
// Material UI components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
// Ant Design Icons
import { PlusOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
// style
import { pageStyles, modalWrapperStyles } from '../../assets/styles/pageStyles';
// Project components
import MainCard from '../MainCard';
import CustomDataTable from './CustomDataTable';
import ModalWrapper from './ModalWrapper';

const CustomDataPage = ({
  title,
  data = [],
  columns = [],
  filterComponent,
  searchPlaceholder = 'Tìm kiếm...',
  onSearch,
  onView,
  onDelete,
  onAddChild,
  permissions = { create: true, edit: true, view: true, delete: true },
  showCheckbox = true,
  actionType = 'icon-text', // 'icon', 'text', 'icon-text'
  createComponent,
  editComponent,
  viewComponent,
  collapsible = false,
  renderCollapse,
  loading = false,
  pagination = { page: 0, rowsPerPage: 10, totalItems: 0 },
  onChangePage,
  onChangeRowsPerPage,
  enableSearch = true,
  enableFilter = true,
  enablePagination = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openViewForm, setOpenViewForm] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch?.(value);
    }, 500),
    [onSearch]
  );

  const handleSearch = useCallback(
    (e) => {
      if (enableSearch && onSearch) {
        // Kiểm tra enableSearch && onSearch trước khi gọi
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
      } else if (enableSearch) {
        setSearchTerm(e.target.value);
      }
    },
    [debouncedSearch, enableSearch, onSearch]
  );

  const handleToggleAdvancedFilter = useCallback(() => {
    setShowAdvancedFilter((prev) => !prev);
  }, []);

  const handleSelectionChange = useCallback((selected) => {
    setSelectedItems(selected);
  }, []);

  const handleCreate = useCallback(() => {
    setOpenCreateForm(true);
  }, []);

  const handleEdit = useCallback((item) => {
    setCurrentItem(item);
    setOpenEditForm(true);
  }, []);

  const handleView = useCallback(
    (item) => {
      setCurrentItem(item);
      if (onView) {
        onView(item);
      }
      setOpenViewForm(true);
    },
    [onView]
  );

  const handleDeleteConfirm = useCallback((item) => {
    const ids = Array.isArray(item) ? item.map((i) => i.id) : [item.id]; // Chuyển object (xóa đơn) thành mảng ID
    setItemToDelete(ids);
    setOpenConfirmDialog(true);
  }, []);

  const handleDeleteMultiple = useCallback(() => {
    if (selectedItems.length > 0) {
      setItemToDelete(selectedItems);
      setOpenConfirmDialog(true);
    }
  }, [selectedItems]);

  const handleConfirmDelete = useCallback(() => {
    if (onDelete) {
      onDelete(itemToDelete);
    }
    setOpenConfirmDialog(false);
    setItemToDelete(null);
    setSelectedItems([]);
  }, [itemToDelete, onDelete]);

  const handleCloseForm = useCallback(() => {
    setOpenCreateForm(false);
    setOpenEditForm(false);
    setOpenViewForm(false);
    setCurrentItem(null);
  }, []);

  return (
    <>
      <Box sx={pageStyles.root}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography sx={pageStyles.title}>{title}</Typography>
          {permissions.create && (
            <Button sx={pageStyles.createButton} startIcon={<PlusOutlined />} onClick={handleCreate}>
              Thêm mới
            </Button>
          )}
        </Stack>

        <MainCard
          sx={pageStyles.mainCard}
          title={
            <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
              <Box sx={pageStyles.searchContainer}>
                {/* search feature */}
                {enableSearch && (
                  <TextField
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={handleSearch}
                    variant="outlined"
                    size="small"
                    sx={{ width: { xs: '100%', md: '400px' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchOutlined style={{ fontSize: '16px' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              </Box>
              {/* filter button open/close  */}
              <div style={pageStyles.actionButtons}>
                {selectedItems.length > 0 && permissions.delete && (
                  <Button variant="contained" color="error" onClick={handleDeleteMultiple}>
                    Xóa {selectedItems.length} mục đã chọn
                  </Button>
                )}
                {filterComponent && (
                  <Button variant="contained" color="warning" onClick={handleToggleAdvancedFilter}>
                    <FilterOutlined style={pageStyles.filterIcon} /> Lọc nâng cao
                  </Button>
                )}
              </div>
            </Stack>
          }
        >
          {/* filter feature  */}

          {enableFilter && filterComponent ? (
            <Collapse in={showAdvancedFilter}>
              <Divider sx={pageStyles.collapseDivider} />
              {filterComponent}
            </Collapse>
          ) : null}
        </MainCard>
        {/* Data table */}
        <CustomDataTable
          data={data}
          columns={columns}
          loading={loading}
          showCheckbox={showCheckbox}
          actionType={actionType}
          permissions={permissions}
          collapsible={collapsible}
          renderCollapse={renderCollapse}
          pagination={pagination}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          onSelectionChange={handleSelectionChange}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDeleteConfirm}
          onAddChild={onAddChild}
          enablePagination={enablePagination}
          selected={selectedItems}
          setSelected={setSelectedItems}
        />
      </Box>

      <ModalWrapper
        open={openConfirmDialog}
        title="Xác nhận xóa"
        content={
          <Typography variant="body1">
            {Array.isArray(itemToDelete) && itemToDelete.length > 1
              ? `Bạn có chắc chắn muốn xóa ${itemToDelete.length} mục đã chọn không?`
              : 'Bạn có chắc chắn muốn xóa mục này không?'}
          </Typography>
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmButtonProps={{ color: 'error', variant: 'contained' }}
        cancelButtonProps={{ outlined: 'none', color: 'primary.dark' }}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenConfirmDialog(false)}
        styles={modalWrapperStyles}
      />

      {createComponent && openCreateForm && (
        <ModalWrapper
          open={openCreateForm}
          title="Thêm mới"
          content={createComponent({ item: null, onClose: handleCloseForm })}
          showActions={false}
          onClose={handleCloseForm}
          maxWidth="sm"
          styles={modalWrapperStyles}
        />
      )}

      {editComponent && openEditForm && currentItem && (
        <ModalWrapper
          open={openEditForm}
          title="Chỉnh sửa"
          content={editComponent({ item: currentItem, onClose: handleCloseForm })}
          showActions={false}
          onClose={handleCloseForm}
          maxWidth="md"
          styles={modalWrapperStyles}
        />
      )}

      {viewComponent && openViewForm && currentItem && (
        <ModalWrapper
          open={openViewForm}
          title="Xem chi tiết"
          content={viewComponent({ item: currentItem, onClose: handleCloseForm })}
          showActions={false}
          onClose={handleCloseForm}
          maxWidth="md"
          styles={modalWrapperStyles}
        />
      )}
    </>
  );
};

CustomDataPage.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array,
  columns: PropTypes.array,
  filterComponent: PropTypes.node,
  searchPlaceholder: PropTypes.string,
  onSearch: PropTypes.func,
  onCreate: PropTypes.func,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
  onDelete: PropTypes.func,
  onAddChild: PropTypes.func,
  permissions: PropTypes.shape({
    create: PropTypes.bool,
    edit: PropTypes.bool,
    view: PropTypes.bool,
    delete: PropTypes.bool
  }),
  showCheckbox: PropTypes.bool,
  actionType: PropTypes.oneOf(['icon', 'text', 'icon-text']),
  createComponent: PropTypes.func,
  editComponent: PropTypes.func,
  viewComponent: PropTypes.func,
  collapsible: PropTypes.bool,
  renderCollapse: PropTypes.func,
  loading: PropTypes.bool,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    totalItems: PropTypes.number
  }),
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  enableSearch: PropTypes.bool,
  enableFilter: PropTypes.bool,
  enablePagination: PropTypes.bool
};

export default CustomDataPage;
