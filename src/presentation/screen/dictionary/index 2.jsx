// Custom components
import CustomDataPage from '../../components/CustomTable/CustomDataPage';
import DictionaryFormAction from './DictionaryFormAction';
import DictionaryItemFormAction from './DictionaryItemFormAction';

//notification
import { useNotification } from '../../../contexts/NotificationContext';
import { Box } from '@mui/system';
import { Grid, Paper, Typography } from '@mui/material';
import dictionarieItemsApi from '../../../infrastructure/api/http/dictionaryItem';
import dictionariesApi from '../../../infrastructure/api/http/dictionaries';
import { isSuccessCode } from '../../../app/utils/constants';
import { useCallback, useState } from 'react';
import useSWR, { mutate } from 'swr';

const DictionaryPage = () => {
  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 10
  });

  // State for dictionary items
  const [selectedDict, setSelectedDict] = useState(null);
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [itemsPagination, setItemsPagination] = useState({
    page: 1,
    rowsPerPage: 10
  });

  const dictionariesKey = [
    'dictionaries',
    {
      page: pagination.page - 1,
      size: pagination.rowsPerPage,
      ...(searchTerm && { searchTerm })
    }
  ];

  const {
    data: dictionariesResponse,
    error: dictionariesError,
    isLoading: loading
  } = useSWR(dictionariesKey, ([key, params]) => dictionariesApi.getAllDicts(params));

  const data = dictionariesResponse?.data?.data?.content || [];
  const totalItems = dictionariesResponse?.data?.data?.totalElements || 0;

  const itemsKey = selectedDict
    ? [
        'dictionary-items',
        {
          dictType: selectedDict.dictType,
          page: itemsPagination.page - 1,
          size: itemsPagination.rowsPerPage,
          ...(itemSearchTerm && { searchTerm: itemSearchTerm })
        }
      ]
    : null;

  const {
    data: itemsResponse,
    error: itemsError,
    isLoading: itemsLoading
  } = useSWR(itemsKey, ([key, params]) => dictionarieItemsApi.getAllDictItems(params));

  const itemsData = itemsResponse?.data?.data?.content || [];
  const itemsTotalItems = itemsResponse?.data?.data?.totalElements || 0;

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

  // Dictionary handlers
  const handleDictionarySearch = useCallback((term) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleDictionaryCreate = useCallback(async (newData) => {
    try {
      const { id, ...dataToCreate } = newData;
      const response = await dictionariesApi.createDict(dataToCreate);
      if (response.success || isSuccessCode(response.status)) {
        mutate((key) => Array.isArray(key) && key[0] === 'dictionaries');
      }
    } catch (error) {
      console.error('Có lỗi khi tạo từ điển:', error);
    }
  }, []);

  const handleDictionaryEdit = useCallback(async (editedData) => {
    try {
      const response = await dictionariesApi.updateDict(editedData);
      if (response.success || isSuccessCode(response.status)) {
        mutate((key) => Array.isArray(key) && key[0] === 'dictionaries');
      }
    } catch (error) {
      console.error('Có lỗi khi cập nhật từ điển:', error);
    }
  }, []);

  const handleDictionaryDelete = useCallback(
    async (itemsToDelete) => {
      try {
        const response = await dictionariesApi.deleteDicts(itemsToDelete);
        if (response.success || isSuccessCode(response.status)) {
          mutate((key) => Array.isArray(key) && key[0] === 'dictionaries');

          // Reset selected dict if deleted
          if (selectedDict && itemsToDelete.includes(selectedDict.id)) {
            setSelectedDict(null);
          }
        }
      } catch (error) {
        console.error('Có lỗi khi xóa từ điển:', error);
      }
    },
    [selectedDict]
  );

  // Dictionary Items handlers
  const handleItemSearch = useCallback((term) => {
    setItemSearchTerm(term);
    setItemsPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

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
          mutate((key) => Array.isArray(key) && key[0] === 'dictionary-items');
        }
      } catch (error) {
        console.error('Có lỗi khi tạo mục từ điển:', error);
      }
    },
    [selectedDict]
  );

  const handleItemEdit = useCallback(async (editedData) => {
    try {
      const response = await dictionarieItemsApi.updateDictItem(editedData);
      if (response.success || isSuccessCode(response.status)) {
        mutate((key) => Array.isArray(key) && key[0] === 'dictionary-items');
      }
    } catch (error) {
      console.error('Có lỗi khi cập nhật mục từ điển:', error);
    }
  }, []);

  const handleItemDelete = useCallback(async (itemsToDelete) => {
    try {
      const response = await dictionarieItemsApi.deleteDictItems(itemsToDelete);
      if (response.success || isSuccessCode(response.status)) {
        mutate((key) => Array.isArray(key) && key[0] === 'dictionary-items');
      }
    } catch (error) {
      console.error('Có lỗi khi xóa mục từ điển:', error);
    }
  }, []);

  // Handle row click to show dictionary items
  const handleDictionaryRowClick = useCallback((rowData) => {
    setSelectedDict(rowData);
    setItemSearchTerm('');
    setItemsPagination({ page: 1, rowsPerPage: 10 });
  }, []);

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
              pagination={{ ...pagination, totalItems }}
              onPaginationChange={setPagination}
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
                pagination={{ ...itemsPagination, totalItems: itemsTotalItems }}
                onPaginationChange={setItemsPagination}
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
