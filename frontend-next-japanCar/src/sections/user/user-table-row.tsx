import { useBoolean } from 'minimal-shared/hooks';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { RouterLink } from '@/routes/components';
import { Iconify } from '@/components/iconify';
import { ConfirmDialog } from '@/components/custom-dialog';
import { paths } from '@/routes/paths';
import { IUserItem } from '@/types/user';
import { Label } from '@/components/label';

// ----------------------------------------------------------------------

type Props = {
  row: IUserItem;
  onDeleteRow: () => void;
};

export function UserTableRow({ row, onDeleteRow }: Props) {
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
      <TableRow key={row.userId}>
        <TableCell>{row.userName}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.createdAt?.split("T")[0]}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.isActive === true && 'success') ||
              (row.isActive === false && 'error') ||
              'default'
            }
          >
            {row.isActive ? 'active' : 'inactive'}
          </Label>
        </TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Edit" placement="top" arrow>
              <RouterLink href={paths.dashboard.user.edit(row.userId!)}>
                <IconButton color="warning">
                  <Iconify icon="solar:pen-bold" />
                </IconButton>
              </RouterLink>
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
