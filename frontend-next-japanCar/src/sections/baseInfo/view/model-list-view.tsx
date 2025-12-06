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

  const { models, totalPage, empty, isLoading } = useGetModels(page);

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

      {empty ? renderEmpty() : renderTable()}

      {renderFormDialog()}
    </Box>
  );
}
