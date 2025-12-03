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
import { IAuctionItem } from '@/types/auction';
import { useState } from 'react';
import { fCurrency } from '@/utils/format-number';

// ----------------------------------------------------------------------

type Props = {
  row: IAuctionItem;
  onDeleteRow: () => Promise<void>;
};

export function AuctionTableRow({ row, onDeleteRow }: Props) {
  const confirmDialog = useBoolean();

  const [loading, setLoading] = useState(false);

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
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await onDeleteRow();
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
      <TableRow key={row.auctionId}>
        <TableCell>{row.auctionName}</TableCell>
        <TableCell>{row.auctionDate}</TableCell>
        <TableCell>{fCurrency(row.auctionFee)}</TableCell>
        <TableCell>{row.createdAt?.split('T')[0]}</TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RouterLink href={paths.dashboard.auction.cars(row.auctionId!)}>
              <Button variant="outlined" color="info" size="small">
                Cars
              </Button>
            </RouterLink>
            <Tooltip title="Edit" placement="top" arrow>
              <RouterLink href={paths.dashboard.auction.edit(row.auctionId!)}>
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
