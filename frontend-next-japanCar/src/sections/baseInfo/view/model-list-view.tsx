import { Iconify } from '@/components/iconify';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useBoolean } from 'minimal-shared/hooks';
import { deleteModel, useGetModels } from '@/actions/base-info';
import Loading from '@/app/dashboard/loading';
import { Scrollbar } from '@/components/scrollbar';
import Table from '@mui/material/Table';
import { TableHeadCellProps, TableHeadCustom } from '@/components/table';
import TableBody from '@mui/material/TableBody';
import Stack from '@mui/material/Stack';
import { EmptyContent } from '@/components/empty-content';
import Card from '@mui/material/Card';
import { useCallback, useEffect, useState } from 'react';
import { IModel } from '@/types/car';
import { ModelTableRow } from '../model-table-row';
import { ModelCreateEditForm } from '../model-create-edit-form';
import Pagination from '@mui/material/Pagination';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'modelName', label: 'Model' },
  { id: 'brandName', label: 'Brand' },
  { id: 'createdAt', label: 'Created date' },
  { id: '', width: 88 },
];

export function ModelListView() {
  const formDialog = useBoolean();
  const [item, setItem] = useState<IModel | null>(null);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = () => {
    setPage(1);
    setSearchKeyword(keyword);
  };

  const { models, totalPage, empty, isLoading } = useGetModels(page, searchKeyword);

  const handleDeleteRow = useCallback(async (modelId: number) => {
    await deleteModel(modelId);
  }, []);

  const handleShowEditDialog = useCallback(
    (model: IModel) => {
      setItem(model);
      formDialog.onTrue();
    },
    [formDialog]
  );

  useEffect(() => {
    if (!formDialog.value) {
      setTimeout(() => {
        setItem(null);
      }, 300);
    }
  }, [formDialog]);

  const renderFormDialog = () => (
    <ModelCreateEditForm
      open={formDialog.value}
      onClose={formDialog.onFalse}
      currentItem={item}
    />
  );

  const renderEmpty = () => (
    <Stack sx={{ flex: '1 1 auto', px: { xs: 2.5, md: 1.5 }, py: 8 }}>
      <EmptyContent title="No models" />
    </Stack>
  );

  const renderTable = () => (
    <Card>
      <Box sx={{ p: 2, display: 'flex' }}>
        <TextField
          fullWidth
          placeholder="Search ..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          slotProps={{
            input: {
              sx: {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: keyword ? (
                <InputAdornment position="end">
                  <Iconify
                    icon="mingcute:close-line"
                    sx={{ color: 'text.disabled', cursor: 'pointer' }}
                    onClick={() => {
                      setPage(1);
                      setKeyword('');
                      setSearchKeyword('');
                    }}
                  />
                </InputAdornment>
              ) : null,
            },
          }}
        />
        <Button
          variant="soft"
          sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          onClick={handleSearch}
        >
          <Iconify icon="eva:search-fill" />
        </Button>
      </Box>

      {empty ? (
        renderEmpty()
      ) : (
        <Scrollbar sx={{ minHeight: 350 }}>
          <Table sx={{ minWidth: 500 }}>
            <TableHeadCustom headCells={TABLE_HEAD} />
            <TableBody>
              {models.map((model) => (
                <ModelTableRow
                  key={model.modelId}
                  row={model}
                  onDeleteRow={() => handleDeleteRow(model.modelId!)}
                  onShowEditDialog={() => handleShowEditDialog(model)}
                />
              ))}
            </TableBody>
          </Table>

          <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              page={page}
              count={totalPage}
              onChange={(event, newPage) => setPage(newPage)}
            />
          </Box>
        </Scrollbar>
      )}
    </Card>
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box p={3}>
      <Box display={'flex'} justifyContent={'end'} mb={3}>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={formDialog.onTrue}
        >
          Add model
        </Button>
      </Box>

      {renderTable()}
      {renderFormDialog()}
    </Box>
  );
}
