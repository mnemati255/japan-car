import { useBoolean } from 'minimal-shared/hooks';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Iconify } from '@/components/iconify';
import { ConfirmDialog } from '@/components/custom-dialog';
import { IColor } from '@/types/car';

// ----------------------------------------------------------------------

type Props = {
  row: IColor;
  onDeleteRow: () => void;
  onShowEditDialog: () => void;
};

export function ColorTableRow({ row, onDeleteRow, onShowEditDialog }: Props) {
  const confirmDialog = useBoolean();

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onDeleteRow();
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  return (
    <>
      <TableRow key={row.colorId}>
        <TableCell>{row.colorName}</TableCell>
        <TableCell>{row.createdAt?.split('T')[0]}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Edit" placement="top" arrow>
              <IconButton color="warning" onClick={onShowEditDialog}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="top" arrow>
              <IconButton color="error" onClick={confirmDialog.onTrue}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      {renderConfirmDialog()}
    </>
  );
}
