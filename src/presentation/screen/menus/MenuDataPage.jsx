import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
// Components
import CustomDataPage from '../../components/CustomTable/CustomDataPage';
import ModalWrapper from '../../components/CustomTable/ModalWrapper';
import MenuDataTable from './MenuDataTable';
// Styles
import { modalWrapperStyles } from '../../assets/styles/pageStyles';

/**
 * Extended CustomDataPage with MenuDataTable and additional "Add Child" modal
 */
const MenuDataPage = ({
  title,
  data = [],
  columns = [],
  filterComponent,
  searchPlaceholder = 'Tìm kiếm...',
  onSearch,
  onView,
  onDelete,
  permissions = { create: true, edit: true, view: true, delete: true },
  showCheckbox = true,
  actionType = 'icon-text',
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
  enablePagination = true,
  onAddChild, // New prop for add child functionality
  addChildComponent // Component to render in add child modal
}) => {
  const [childFormOpen, setChildFormOpen] = useState(false);
  const [parentMenuItem, setParentMenuItem] = useState(null);

  const handleAddChild = useCallback((parentMenu) => {
    setParentMenuItem(parentMenu);
    setChildFormOpen(true);
    if (onAddChild) {
      onAddChild(parentMenu);
    }
  }, [onAddChild]);

  const handleCloseChildForm = useCallback(() => {
    setChildFormOpen(false);
    setParentMenuItem(null);
  }, []);

  // Custom render function for data table
  const renderDataTable = useCallback((props) => {
    return (
      <MenuDataTable
        {...props}
        onAddChild={handleAddChild}
      />
    );
  }, [handleAddChild]);

  return (
    <>
      <CustomDataPage
        title={title}
        data={data}
        columns={columns}
        filterComponent={filterComponent}
        searchPlaceholder={searchPlaceholder}
        onSearch={onSearch}
        onView={onView}
        onDelete={onDelete}
        permissions={permissions}
        showCheckbox={showCheckbox}
        actionType={actionType}
        createComponent={createComponent}
        editComponent={editComponent}
        viewComponent={viewComponent}
        collapsible={collapsible}
        renderCollapse={renderCollapse}
        loading={loading}
        pagination={pagination}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        enableSearch={enableSearch}
        enableFilter={enableFilter}
        enablePagination={enablePagination}
        customDataTable={renderDataTable}
      />

      {/* Modal for adding child menu */}
      {addChildComponent && (
        <ModalWrapper
          open={childFormOpen}
          title={`Thêm menu con cho: ${parentMenuItem?.item?.name || ''}`}
          content={addChildComponent({ 
            item: null, 
            parentId: parentMenuItem?.item?.id,
            parentMenu: parentMenuItem,
            onClose: handleCloseChildForm 
          })}
          maxWidth="sm"
          showActions={false}
          onClose={handleCloseChildForm}
          styles={modalWrapperStyles}
        />
      )}
    </>
  );
};

MenuDataPage.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array,
  columns: PropTypes.array,
  filterComponent: PropTypes.node,
  searchPlaceholder: PropTypes.string,
  onSearch: PropTypes.func,
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
  onChangeRowsPerPage: PropTypes.func,
  enableSearch: PropTypes.bool,
  enableFilter: PropTypes.bool,
  enablePagination: PropTypes.bool,
  onAddChild: PropTypes.func,
  addChildComponent: PropTypes.func
};

export default MenuDataPage;