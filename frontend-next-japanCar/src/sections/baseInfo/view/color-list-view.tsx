import { Iconify } from '@/components/iconify';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useBoolean } from 'minimal-shared/hooks';
import { deleteColor, useGetColors } from '@/actions/base-info';
import Loading from '@/app/dashboard/loading';
import { Scrollbar } from '@/components/scrollbar';
import Table from '@mui/material/Table';
import { TableHeadCellProps, TableHeadCustom } from '@/components/table';
import TableBody from '@mui/material/TableBody';
import Stack from '@mui/material/Stack';
import { EmptyContent } from '@/components/empty-content';
import Card from '@mui/material/Card';
import { useCallback, useEffect, useState } from 'react';
import { IColor } from '@/types/car';
import { ColorCreateEditForm } from '../color-create-edit-form';
import { ColorTableRow } from '../color-table-row';
import Pagination from '@mui/material/Pagination';

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'colorName', label: 'Color' },
  { id: 'createdAt', label: 'Created date' },
  { id: '', width: 88 },
];

export function ColorListView() {
  const formDialog = useBoolean();
  const [item, setItem] = useState<IColor | null>(null);
  const [page, setPage] = useState(1);

  const { colors, totalPage, empty, isLoading } = useGetColors(page);

  const handleDeleteRow = useCallback(async (colorId: number) => {
    await deleteColor(colorId);
  }, []);

  const handleShowEditDialog = useCallback(
    (color: IColor) => {
      setItem(color);
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
    <ColorCreateEditForm
      open={formDialog.value}
      onClose={formDialog.onFalse}
      currentItem={item}
    />
  );

  const renderEmpty = () => (
    <Stack sx={{ flex: '1 1 auto', px: { xs: 2.5, md: 1.5 }, py: 8 }}>
      <EmptyContent title="No colors" />
    </Stack>
  );

  const renderTable = () => (
    <Card>
      <Scrollbar sx={{ minHeight: 350 }}>
        <Table sx={{ minWidth: 500 }}>
          <TableHeadCustom headCells={TABLE_HEAD} />
          <TableBody>
            {colors.map((color) => (
              <ColorTableRow
                key={color.colorId}
                row={color}
                onDeleteRow={() => handleDeleteRow(color.colorId!)}
                onShowEditDialog={() => handleShowEditDialog(color)}
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
          Add color
        </Button>
      </Box>

      {empty ? renderEmpty() : renderTable()}

      {renderFormDialog()}
    </Box>
  );
}
