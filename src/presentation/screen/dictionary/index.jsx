/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from 'react';

// Custom components
import CustomDataPage from '../../components/CustomTable/CustomDataPage';

import DictionaryFormAction from './DictionaryFormAction';
import DictionaryItemFormAction from './DictionaryItemFormAction';

//notification
import { useNotification } from '../../../contexts/NotificationContext';
import { Box } from '@mui/system';
import { Grid, Grid2, Paper, Typography } from '@mui/material';
import dictionarieItemsApi from '../../../infrastructure/api/http/dictionaryItem';
import dictionariesApi from '../../../infrastructure/api/http/dictionaries';

const DictionaryPage = () => {
  // State for dictionaries
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 10,
    totalItems: 0
  });

  // State for dictionary items
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [selectedDict, setSelectedDict] = useState(null);
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [itemsPagination, setItemsPagination] = useState({
    page: 1,
    rowsPerPage: 10,
    totalItems: 0
  });

  //notification
  const { showNotification } = useNotification();

  // Columns definition for dictionaries
  const dictionaryColumns = [
    {
      id: 'name',
      label: 'Tên từ điển',
      minWidth: 120,
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
        </div>
      )
    },
    {
      id: 'description',
      label: 'Mô tả',
      minWidth: 180,
      sortable: false
    }
  ];

  // Columns definition for dictionary items
  const itemColumns = [
    {
      id: 'label',
      label: 'Nhãn',
      minWidth: 120,
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
        </div>
      )
    },
    {
      id: 'value',
      label: 'Giá trị',
      minWidth: 100,
      sortable: true,
      render: (value) => <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-mono text-xs">{value}</span>
    },
    {
      id: 'description',
      label: 'Mô tả',
      minWidth: 180,
      sortable: false
    }
  ];

  //check response code
  const isSuccessCode = (code) => code >= 200 && code < 300;

  // Dictionary API calls
  const fetchDictionaries = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await dictionariesApi.getAllDicts(params);
      if (response.data.success) {
        setData(response.data.data.content);
        setPagination((prev) => ({
          ...prev,
          totalItems: response.data.data.totalElements
        }));
      }
    } catch (err) {
      console.log('Lỗi khi gọi API dictionaries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Dictionary Items API calls
  const fetchDictionaryItems = useCallback(async (dictType, params = {}) => {
    if (!dictType) return;

    setItemsLoading(true);
    try {
      const response = await dictionarieItemsApi.getAllDictItems({
        ...params,
        dictType: dictType
      });
      if (response.data.success) {
        setItemsData(response.data.data.content);
        setItemsPagination((prev) => ({
          ...prev,
          totalItems: response.data.data.totalElements
        }));
      }
    } catch (err) {
      console.log('Lỗi khi gọi API dictionary items:', err);
    } finally {
      setItemsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDictionaries();
  }, []);

  // Dictionary handlers
  const applyDictionaryFilters = useCallback(
    async (searchTerm) => {
      setLoading(true);
      const reqBody = {
        page: 0,
        size: pagination.rowsPerPage
      };

      if (searchTerm) reqBody.searchTerm = searchTerm;
      setPagination((prev) => ({ ...prev, page: 1 }));
      await fetchDictionaries(reqBody);
    },
    [pagination.rowsPerPage, fetchDictionaries]
  );

  const handleDictionarySearch = useCallback(
    (term) => {
      setSearchTerm(term);
      applyDictionaryFilters(term);
    },
    [applyDictionaryFilters]
  );

  const handleDictionaryCreate = useCallback(
    async (newData) => {
      try {
        const { id, ...dataToCreate } = newData;
        const response = await dictionariesApi.createDict(dataToCreate);
        if (response.success || isSuccessCode(response.status)) {
          showNotification('Thêm từ điển thành công', 'success');
          await fetchDictionaries();
        }
      } catch (error) {
        console.error('Có lỗi khi tạo từ điển:', error);
        showNotification('Có lỗi xảy ra khi tạo từ điển!', 'error');
      }
    },
    [fetchDictionaries, showNotification, isSuccessCode]
  );

  const handleDictionaryEdit = useCallback(
    async (editedData) => {
      try {
        const response = await dictionariesApi.updateDict(editedData);
        if (response.success || isSuccessCode(response.status)) {
          showNotification('Cập nhật từ điển thành công', 'success');
          await fetchDictionaries();
        }
      } catch (error) {
        console.error('Có lỗi khi cập nhật từ điển:', error);
        showNotification('Có lỗi xảy ra khi cập nhật từ điển!', 'error');
      }
    },
    [fetchDictionaries, showNotification, isSuccessCode]
  );

  const handleDictionaryDelete = useCallback(
    async (itemsToDelete) => {
      try {
        const response = await dictionariesApi.deleteDicts(itemsToDelete);
        if (response.success || isSuccessCode(response.status)) {
          showNotification('Xóa từ điển thành công', 'success');
          await fetchDictionaries();
          // Reset selected dict and items if deleted
          if (selectedDict && itemsToDelete.includes(selectedDict.id)) {
            setSelectedDict(null);
            setItemsData([]);
          }
        }
      } catch (error) {
        console.error('Có lỗi khi xóa từ điển:', error);
        showNotification('Có lỗi xảy ra khi xóa từ điển!', 'error');
      }
    },
    [fetchDictionaries, showNotification, isSuccessCode, selectedDict]
  );

  // Dictionary Items handlers
  const applyItemFilters = useCallback(
    async (searchTerm) => {
      if (!selectedDict) return;
      setItemsLoading(true);
      const reqBody = {
        page: 0,
        size: itemsPagination.rowsPerPage
      };

      if (searchTerm) reqBody.searchTerm = searchTerm;
      setItemsPagination((prev) => ({ ...prev, page: 1 }));

      await fetchDictionaryItems(selectedDict.dictType, reqBody);
    },
    [selectedDict, itemsPagination.rowsPerPage, fetchDictionaryItems]
  );

  const handleItemSearch = useCallback(
    (term) => {
      setItemSearchTerm(term);
      applyItemFilters(term);
    },
    [applyItemFilters]
  );

  const handleItemCreate = useCallback(
    async (newData) => {
      try {
        const { id, ...dataToCreate } = newData;
        const dataWithDictType = {
          ...dataToCreate,
          dictType: selectedDict?.dictType
        };
        const response = await dictionarieItemsApi.createDictItem(dataWithDictType);
        if (response.success || isSuccessCode(response.status)) {
          showNotification('Thêm mục từ điển thành công', 'success');
          await fetchDictionaryItems(selectedDict.dictType);
        }
      } catch (error) {
        console.error('Có lỗi khi tạo mục từ điển:', error);
        showNotification('Có lỗi xảy ra khi tạo mục từ điển!', 'error');
      }
    },
    [selectedDict, fetchDictionaryItems, showNotification, isSuccessCode]
  );

  const handleItemEdit = useCallback(
    async (editedData) => {
      try {
        const response = await dictionarieItemsApi.updateDictItem(editedData);
        if (response.success || isSuccessCode(response.status)) {
          showNotification('Cập nhật mục từ điển thành công', 'success');
          await fetchDictionaryItems(selectedDict.dictType);
        }
      } catch (error) {
        console.error('Có lỗi khi cập nhật mục từ điển:', error);
        showNotification('Có lỗi xảy ra khi cập nhật mục từ điển!', 'error');
      }
    },
    [selectedDict, fetchDictionaryItems, showNotification, isSuccessCode]
  );

  const handleItemDelete = useCallback(
    async (itemsToDelete) => {
      try {
        const response = await dictionarieItemsApi.deleteDictItems(itemsToDelete);
        if (response.success || isSuccessCode(response.status)) {
          showNotification('Xóa mục từ điển thành công', 'success');
          await fetchDictionaryItems(selectedDict.dictType);
        }
      } catch (error) {
        console.error('Có lỗi khi xóa mục từ điển:', error);
        showNotification('Có lỗi xảy ra khi xóa mục từ điển!', 'error');
      }
    },
    [selectedDict, fetchDictionaryItems, showNotification, isSuccessCode]
  );

  // Handle row click to show dictionary items
  const handleDictionaryRowClick = useCallback(
    (rowData) => {
      setSelectedDict(rowData);
      setItemsData([]);
      setItemSearchTerm('');
      fetchDictionaryItems(rowData.dictType);
    },
    [fetchDictionaryItems]
  );

  return (
    <Box sx={{ backgroundColor: '#f5f5f5' }}>
      <Grid container spacing={3}>
        <Grid item lg={12} xl={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h3" gutterBottom>
              Từ điển
            </Typography>
            <CustomDataPage
              data={data}
              columns={dictionaryColumns}
              page="dictionaries"
              onSearch={handleDictionarySearch}
              onCreate={handleDictionaryCreate}
              onEdit={handleDictionaryEdit}
              onDelete={handleDictionaryDelete}
              createComponent={(props) => (
                <DictionaryFormAction {...props} title="Thêm chức vụ mới" isView={false} onSubmit={handleDictionaryCreate} />
              )}
              editComponent={(props) => (
                <DictionaryFormAction {...props} title="Chỉnh sửa chức vụ" isView={false} onSubmit={handleDictionaryEdit} />
              )}
              viewComponent={(props) => <DictionaryFormAction {...props} title="Xem chi tiết chức vụ" isView={true} />}
              permissions={{ assignRole: false, create: true, edit: true, view: true, delete: true }}
              onRowClick={handleDictionaryRowClick}
              searchPlaceholder="Tìm kiếm theo tên từ điển..."
              loading={loading}
              enableSearch
              enablePagination
            />
          </Paper>
        </Grid>
        <Grid item lg={12} xl={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h3" gutterBottom>
              Chi tiết từ điển
            </Typography>
            {selectedDict && <Typography>Từ điển: {selectedDict.name}</Typography>}
            {selectedDict ? (
              <CustomDataPage
                data={itemsData}
                columns={itemColumns}
                page="dictionary-items"
                onSearch={handleItemSearch}
                onCreate={handleItemCreate}
                onEdit={handleItemEdit}
                onDelete={handleItemDelete}
                createComponent={(props) => (
                  <DictionaryItemFormAction
                    {...props}
                    title="Thêm chức vụ mới"
                    isView={false}
                    onSubmit={handleItemCreate}
                    dictType={selectedDict.name}
                  />
                )}
                editComponent={(props) => (
                  <DictionaryItemFormAction
                    {...props}
                    title="Chỉnh sửa chức vụ"
                    isView={false}
                    onSubmit={handleItemEdit}
                    dictType={selectedDict.name}
                  />
                )}
                viewComponent={(props) => (
                  <DictionaryItemFormAction {...props} title="Xem chi tiết chức vụ" isView={true} dictType={selectedDict.name} />
                )}
                permissions={{ assignRole: false, create: true, edit: true, view: true, delete: true }}
                searchPlaceholder="Tìm kiếm theo nhãn của từ điển..."
                loading={itemsLoading}
                enableSearch
                enablePagination
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Chưa chọn từ điển
                </Typography>
                <Typography variant="body2">Vui lòng chọn một từ điển để xem chi tiết</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DictionaryPage;
