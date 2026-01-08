import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Iconify } from '@/components/iconify';
import { fCurrency } from '@/utils/format-number';
import { ICar } from '@/types/car';
import Avatar from '@mui/material/Avatar';
import { CONFIG } from '@/global-config';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { fDate } from '@/utils/format-time';
import { paths } from '@/routes/paths';
import IconButton from '@mui/material/IconButton';
import CarReportRepairsDialog from './car-report-repairs-dialog';
import { useBoolean } from 'minimal-shared/hooks';
import { getItems } from '@/actions/base-action';
import { IRepair } from '@/types/repair';
import { endpoints } from '@/lib/axios';
import { useState } from 'react';

// ----------------------------------------------------------------------

type Props = {
  row: ICar;
};

export function CarReportTableRow({ row }: Props) {
  const repairsDialog = useBoolean();
  const [repairsData, setRepairsData] = useState<IRepair[]>([]);

  const handleGetDetails = async () => {
    const { status, data } = await getItems<IRepair[]>(
      `${endpoints.repair}/details-by-carId/${row.carId}`
    );
    if (status == 200) {
      setRepairsData(data);
      repairsDialog.onTrue();
    }
  };

  const renderRepairsDialog = () => (
    <CarReportRepairsDialog
      open={repairsDialog.value}
      onClose={() => repairsDialog.onFalse()}
      data={repairsData}
    />
  );

  return (
    <>
      <TableRow
        sx={{ cursor: 'pointer' }}
        onDoubleClick={() => window.open(paths.dashboard.car.edit(row.carId!), '_blank')}
      >
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
        <TableCell>{fDate(row.purchaseDate)}</TableCell>
        <TableCell>{fCurrency(row.purchasePrice)}</TableCell>
        <TableCell>{fCurrency(row.finalPrice)}</TableCell>
        <TableCell>{row.sukuraNumber}</TableCell>
        <TableCell>{fDate(row.createdAt)}</TableCell>
        <TableCell>
          <IconButton onClick={handleGetDetails}>
            <Iconify icon="hugeicons:repair" />
          </IconButton>
        </TableCell>
      </TableRow>
      {renderRepairsDialog()}
    </>
  );
}
