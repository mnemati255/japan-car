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
import { Label } from '@/components/label';
import { useTranslate } from '@/locales';
import { ICustomer } from '@/types/customer';

// ----------------------------------------------------------------------

type Props = {
  row: ICustomer;
  onDeleteRow: () => void;
};

export function CustomerTableRow({ row, onDeleteRow }: Props) {
  const confirmDialog = useBoolean();
  const { t: tCommon } = useTranslate('common');

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title={tCommon('delete')}
      content={tCommon('deleteText')}
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onDeleteRow();
            confirmDialog.onFalse();
          }}
        >
          {tCommon('delete')}
        </Button>
      }
    />
  );

  return (
    <>
      <TableRow key={row.customerId}>
        <TableCell>{row.firstName}</TableCell>
        <TableCell>{row.lastName}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.phone}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.isActive === true && 'success') ||
              (row.isActive === false && 'error') ||
              'default'
            }
          >
            {row.isActive ? tCommon('active') : tCommon('inactive')}
          </Label>
        </TableCell>

        <TableCell>{row.createdAt?.split('T')[0]}</TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Edit" placement="top" arrow>
              <RouterLink href={paths.dashboard.customer.edit(row.customerId!)}>
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
