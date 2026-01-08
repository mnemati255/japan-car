import { Iconify } from '@/components/iconify';
import { Scrollbar } from '@/components/scrollbar';
import { useTranslateFromServer } from '@/locales';
import { IRepair } from '@/types/repair';
import { fCurrency } from '@/utils/format-number';
import { fDate } from '@/utils/format-time';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

type Props = {
  open: boolean;
  onClose: () => void;
  data: IRepair[];
};

export default function CarReportRepairsDialog({ open, onClose, data }: Props) {
  const { translations } = useTranslateFromServer();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ textAlign: 'right' }}>
        <IconButton onClick={onClose}>
          <Iconify icon="carbon:close" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mb: 4 }}>
        {data.map((x, index) => (
          <Box
            key={`ind_${index}`}
            sx={{ border: 1, borderRadius: 1, borderColor: 'gray', p: 2 }}
          >
            <Typography>{fDate(x.repairDate)}</Typography>
            <Scrollbar sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <Table sx={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{translations['PartName']}</TableCell>
                    <TableCell>{translations['PartCount']}</TableCell>
                    <TableCell>{translations['MechanicName']}</TableCell>
                    <TableCell>{translations['PartCost']}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    '& .MuiTableCell-root': {
                      p: '4px',
                    },
                  }}
                >
                  {x.parts.map((y, index2) => (
                    <TableRow key={`ind2_${index2}`}>
                      <TableCell>{y.partName}</TableCell>
                      <TableCell>{y.partCount}</TableCell>
                      <TableCell>{y.mechanicName}</TableCell>
                      <TableCell>{fCurrency(y.partCost)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
}
