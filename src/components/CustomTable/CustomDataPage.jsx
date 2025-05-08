import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

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
  onCreate,
  onEdit,
  onView,
  onDelete,
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
  onChangeRowsPerPage
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

  const handleSearch = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      if (onSearch) {
        onSearch(value);
      }
    },
    [onSearch]
  );

  const handleToggleAdvancedFilter = useCallback(() => {
    setShowAdvancedFilter((prev) => !prev);
  }, []);

  const handleSelectionChange = useCallback((selected) => {
    setSelectedItems(selected);
  }, []);

  const handleCreate = useCallback(() => {
    if (onCreate) {
      onCreate();
    }
    setOpenCreateForm(true);
  }, [onCreate]);

  const handleEdit = useCallback(
    (item) => {
      setCurrentItem(item);
      if (onEdit) {
        onEdit(item);
      }
      setOpenEditForm(true);
    },
    [onEdit]
  );

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
    setItemToDelete(item);
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
      <Box sx={{ width: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h3">{title}</Typography>
          {permissions.create && (
            <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleCreate}>
              Thêm mới
            </Button>
          )}
        </Stack>

        <MainCard
          sx={{ mb: 3 }}
          title={
            <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
              </Box>
              <div style={{ display: 'flex', gap: 30 }}>
                {selectedItems.length > 0 && permissions.delete && (
                  <Button variant="contained" color="error" onClick={handleDeleteMultiple}>
                    Xóa {selectedItems.length} mục đã chọn
                  </Button>
                )}
                <Button variant="contained" color="warning" onClick={handleToggleAdvancedFilter}>
                  <FilterOutlined style={{ marginRight: 10 }} /> Lọc nâng cao
                </Button>
              </div>
            </Stack>
          }
        >
          <Collapse in={showAdvancedFilter}>
            <Divider sx={{ mt: -1, mb: 2 }} />
            {filterComponent}
          </Collapse>
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
        />
      </Box>

      <ModalWrapper
        open={openConfirmDialog}
        title="Xác nhận xóa"
        content={
          <Typography variant="body1">
            {Array.isArray(itemToDelete)
              ? `Bạn có chắc chắn muốn xóa ${itemToDelete.length} mục đã chọn không?`
              : 'Bạn có chắc chắn muốn xóa mục này không?'}
          </Typography>
        }
        confirmText="Xóa"
        confirmButtonProps={{ color: 'error', variant: 'contained' }}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenConfirmDialog(false)}
      />

      {createComponent && openCreateForm && (
        <ModalWrapper
          open={openCreateForm}
          title="Thêm mới"
          content={createComponent({ item: null, onClose: handleCloseForm })}
          showActions={false}
          onClose={handleCloseForm}
          maxWidth="sm"
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
  onChangeRowsPerPage: PropTypes.func
};

export default CustomDataPage;
