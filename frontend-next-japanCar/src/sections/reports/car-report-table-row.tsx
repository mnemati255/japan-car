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

// ----------------------------------------------------------------------

type Props = {
  row: ICar;
};

export function CarReportTableRow({ row }: Props) {
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
      </TableRow>
    </>
  );
}
