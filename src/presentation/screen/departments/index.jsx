import { useState, useEffect, useCallback } from 'react';
import { Chip } from '@mui/material';
import CustomDataPage from '../../components/CustomTable/CustomDataPage';
import DepartmentFormAction from './DepartmentFormAction';
import DepartmentAdvancedFilter from './DepartmentAdvancedFilter';
import { getDepartmentColumns } from './departmentColumns';
// API
import departmentApi from '../../../infrastructure/api/http/department';

// Mock data - thay thế bằng API call thực tế
const mockDepartments = [
  { id: 1, code: 'IT', name: 'Công nghệ thông tin', description: 'Phòng ban IT', status: 'active', createdAt: '2024-01-15' },
  { id: 2, code: 'HR', name: 'Nhân sự', description: 'Phòng ban nhân sự', status: 'active', createdAt: '2024-01-20' },
  { id: 3, code: 'FIN', name: 'Tài chính', description: 'Phòng ban tài chính', status: 'inactive', createdAt: '2024-02-01' }
];

export default function DepartmentPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 10,
    totalItems: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [expandedItems, setExpandedItems] = useState([]);
  const [flatDepartments, setFlatDepartments] = useState([]);

  // Handle expand/collapse
  const handleToggleExpand = useCallback((itemId) => {
    setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
  }, []);

  // Get columns with expand functionality
  const columns = getDepartmentColumns(expandedItems, handleToggleExpand);

  // Load data
  const loadDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const requestData = {
        page: pagination.page,
        size: pagination.rowsPerPage,
        sortBy: 'createTime',
        searchTerm: searchTerm || '',
        sortDirection: 'DESC',
        keyword: searchTerm || '',
        parentId: filters.parentId || '',
        lockFlag: filters.lockFlag || ''
      };

      const response = await departmentApi.getAllDepartmentAndSearch(requestData);
      const rawData = response.data.content || [];

      setFlatDepartments(rawData); // Store original tree data
      setPagination((prev) => ({
        ...prev,
        totalItems: response.data?.totalElements || 0
      }));
    } catch (error) {
      console.error('Error loading departments:', error);
      setFlatDepartments([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, pagination.page, pagination.rowsPerPage]);

  // Flatten tree for display based on expanded items
  const flattenTree = useCallback(
    (items, level = 0) => {
      let result = [];

      items.forEach((item) => {
        // Add current item with level
        const itemWithLevel = { ...item, level };
        result.push(itemWithLevel);

        // Add children if expanded
        if (item.children && item.children.length > 0 && expandedItems.includes(item.item.id)) {
          result = result.concat(flattenTree(item.children, level + 1));
        }
      });

      return result;
    },
    [expandedItems]
  );

  // Update displayed departments when expandedItems or flatDepartments change
  useEffect(() => {
    const departmentList = flattenTree(flatDepartments).map((dept) => ({
      ...dept,
      id: dept.item?.id // Add id at root level for CustomDataTable
    }));
    setDepartments(departmentList);
  }, [flatDepartments, flattenTree]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  // Event handlers
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleFilter = useCallback((filterData) => {
    setFilters(filterData);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleResetFilter = useCallback((resetData) => {
    setFilters(resetData);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleChangePage = useCallback((newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleChangeRowsPerPage = useCallback((newRowsPerPage) => {
    setPagination((prev) => ({ ...prev, rowsPerPage: newRowsPerPage, page: 1 }));
  }, []);

  const handleDelete = useCallback(
    async (itemOrIds) => {
      try {
        setLoading(true);

        // Extract IDs from the data structure
        let idsToDelete;
        if (Array.isArray(itemOrIds)) {
          // Multiple items selected
          idsToDelete = itemOrIds.map((item) => item?.item?.id || item?.id || item);
        } else {
          // Single item
          idsToDelete = [itemOrIds?.item?.id || itemOrIds?.id || itemOrIds];
        }

        console.log('Deleting IDs:', idsToDelete);

        // Delete each department
        await Promise.all(idsToDelete.map((id) => departmentApi.deleteDepartment(id)));

        // Reload data after successful deletion
        await loadDepartments();
      } catch (error) {
        console.error('Error deleting departments:', error);
      } finally {
        setLoading(false);
      }
    },
    [loadDepartments]
  );

  const handleRowClick = useCallback((department) => {
    console.log('Row clicked:', department);
  }, []);

  // Component wrappers with reload callback
  const CreateDepartmentForm = useCallback(
    ({ item, onClose }) => {
      return (
        <DepartmentFormAction
          item={item}
          departmentOptions={flatDepartments}
          onClose={() => {
            onClose();
            loadDepartments();
          }}
        />
      );
    },
    [loadDepartments, flatDepartments]
  );

  const EditDepartmentForm = useCallback(
    ({ item, onClose }) => {
      // Extract actual item data from nested structure
      const actualItem = item?.item || item;
      return (
        <DepartmentFormAction
          item={actualItem}
          departmentOptions={flatDepartments}
          onClose={() => {
            onClose();
            loadDepartments();
          }}
        />
      );
    },
    [loadDepartments, flatDepartments]
  );

  const ViewDepartmentForm = useCallback(({ item, onClose }) => {
    // Extract actual item data from nested structure
    const actualItem = item?.item || item;
    return <DepartmentFormAction item={actualItem} onClose={onClose} readOnly={true} />;
  }, []);

  return (
    <CustomDataPage
      title="Quản lý phòng ban"
      data={departments}
      columns={columns}
      loading={loading}
      pagination={pagination}
      searchPlaceholder="Tìm kiếm phòng ban..."
      emptyMessage="Không có phòng ban nào"
      permissions={{
        create: true,
        edit: true,
        view: true,
        delete: true,
        assignRole: false
      }}
      onSearch={handleSearch}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      onDelete={handleDelete}
      onRowClick={handleRowClick}
      createComponent={CreateDepartmentForm}
      editComponent={EditDepartmentForm}
      viewComponent={ViewDepartmentForm}
      filterComponent={<DepartmentAdvancedFilter onFilter={handleFilter} departmentCodes={flatDepartments} />}
      collapsible={false}
    />
  );
}
