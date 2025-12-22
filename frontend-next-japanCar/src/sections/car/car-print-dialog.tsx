import { Iconify } from '@/components/iconify';
import { useTranslateFromServer } from '@/locales';
import { useRouter } from '@/routes/hooks';
import { paths } from '@/routes/paths';
import { ICar } from '@/types/car';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import Box from '@mui/material/Box';

type Props = {
  open: boolean;
  onClose?: () => void;
  car: ICar;
  auctionId?: number;
  isUpdated?: boolean;
  model: string;
};

export function CarPrintDialog({
  open,
  onClose,
  car,
  model,
  auctionId,
  isUpdated,
}: Props) {
  const { translations } = useTranslateFromServer();
  const router = useRouter();
  const printInfoRef = useRef<HTMLDivElement>(null);
  const printSukuraRef = useRef<HTMLDivElement>(null);

  const handlePrintInfo = useReactToPrint({
    contentRef: printInfoRef,
    documentTitle: 'car-info',
  });
  const handlePrintSukura = useReactToPrint({
    contentRef: printSukuraRef,
    documentTitle: 'car-info',
  });

  return (
    <Dialog open={open}>
      <DialogTitle sx={{ textAlign: 'right' }}>
        <IconButton
          onClick={() => {
            if (onClose != null) onClose();
            else {
              if (!auctionId) router.push(paths.dashboard.car.root);
              else router.push(paths.dashboard.auction.cars(auctionId));
            }
          }}
        >
          <Iconify icon="carbon:close" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isUpdated && (
          <Typography textAlign={'center'}>
            {!isUpdated ? translations['create_success'] : translations['update_success']}
          </Typography>
        )}
        <Box
          ref={printInfoRef}
          className="print-only"
          sx={{ height: '100%', width: '100%' }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              height: '100%',
            }}
          >
            <Typography variant="h2">
              {translations['PurchaseDate']}: {car.purchaseDate?.split(' ')[0]}
            </Typography>
            <Typography variant="h1">
              {model} {car.year}
            </Typography>
            <Typography variant="h2">
              {translations['ChassisNumber']}: {car.chasisNumber}
            </Typography>
          </Box>
        </Box>

        <Box
          ref={printSukuraRef}
          className="print-only"
          sx={{ height: '100%', width: '100%' }}
        >
          <Box
            sx={{
              display: 'grid',
              rowGap: 5,
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Box>
              <Typography variant="h3" textAlign={'center'}>
                {translations['SukuraNumber']}
              </Typography>
              <Typography sx={{ textAlign: 'center', fontSize: 120, fontWeight: 'bold' }}>
                {car.sukuraNumber}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        {car.forSale == 1 && (
          <Button variant="soft" onClick={handlePrintSukura}>
            {translations['PrintSukura']}
          </Button>
        )}
        <Button variant="soft" color="info" onClick={handlePrintInfo}>
          {translations['PrintInfo']}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
