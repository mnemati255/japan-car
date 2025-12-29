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
import { FORSALEITEMS } from '@/constants/car-constants';

type Props = {
  open: boolean;
  onClose?: () => void;
  car: ICar;
  auctionId?: number;
  isUpdated?: boolean;
};

export function CarPrintDialog({ open, onClose, car, auctionId, isUpdated }: Props) {
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

  const renderHeader = (str: string) => (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography>
        {car.brandName}-{car.modelName}
        {car.grad ? `-${car.grad}` : ''}
        {car.point ? `-${car.point}` : ''}-{car.chasisNumber}
      </Typography>
      <Typography>{car.purchaseDate}</Typography>
      <Typography sx={{ fontSize: 40 }}>{str}</Typography>
    </Box>
  );

  const renderFooter = () => (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" sx={{ textAlign: 'center' }}>
        54-4 Takasaki Sakura-Shi Chiba JAPAN
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>ARKSTARINC@HOTMAIL.COM</Typography>
        <Typography>FAX: +81434846330</Typography>
      </Box>
      <Typography variant="h5">ARKSTAR INTERNATIONAL Co.,Ltd.</Typography>
    </Box>
  );

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
              justifyContent: 'space-between',
              rowGap: 5,
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            {renderHeader(FORSALEITEMS.find((x) => x.value == car.forSale)?.title ?? '')}
            <Typography variant="h2">{car.chasisNumber}</Typography>
            {renderFooter()}
          </Box>
        </Box>

        <Box
          ref={printSukuraRef}
          className="print-only"
          sx={{ height: '100%', width: '100%' }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              rowGap: 5,
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            {renderHeader('SK')}
            <Typography sx={{ textAlign: 'center', fontSize: 120, fontWeight: 'bold' }}>
              {car.sukuraNumber}
            </Typography>
            {renderFooter()}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        {car.sukuraNumber && (
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
