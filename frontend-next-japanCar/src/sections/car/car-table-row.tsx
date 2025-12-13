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
import { useState } from 'react';
import { fCurrency } from '@/utils/format-number';
import { ICar } from '@/types/car';
import Avatar from '@mui/material/Avatar';
import { CONFIG } from '@/global-config';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslate } from '@/locales';

// ----------------------------------------------------------------------

type Props = {
  auctionId: number | null;
  row: ICar;
  onDeleteRow: () => Promise<void>;
};

export function CarTableRow({ row, onDeleteRow, auctionId }: Props) {
  const confirmDialog = useBoolean();
  const [loading, setLoading] = useState(false);
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
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await onDeleteRow();
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
      <TableRow>
        <TableCell>
          <Stack direction={'row'} alignItems={'center'} spacing={1}>
            {row.images.length > 0 ? (
              <Avatar src={`${CONFIG.carsImagesDir}/${row.images[0]}`} />
            ) : (
              <Avatar>
                <Iconify icon="solar:box-minimalistic-bold" />
              </Avatar>
            )}
            <Stack>
              <Typography variant="body2">{row.brandName}</Typography>
              <Typography variant="body2" color="textDisabled" mt={0.5}>
                {row.modelName} {row.year}-{row.colorName}
              </Typography>
            </Stack>
          </Stack>
        </TableCell>
        {/* {!auctionId && <TableCell>{row.auctionName}</TableCell>} */}
        <TableCell>{fCurrency(row.purchasePrice)}</TableCell>
        <TableCell>{fCurrency(row.finalPrice)}</TableCell>
        <TableCell>{row.createdAt?.split('T')[0]}</TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Edit" placement="top" arrow>
              <RouterLink
                href={
                  !auctionId
                    ? paths.dashboard.car.edit(row.carId!)
                    : paths.dashboard.auction.editCar(auctionId, row.carId!)
                }
              >
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
