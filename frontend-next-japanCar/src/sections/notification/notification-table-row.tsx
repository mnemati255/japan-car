import { useBoolean } from 'minimal-shared/hooks';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { ConfirmDialog } from '@/components/custom-dialog';
import { paths } from '@/routes/paths';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslate, useTranslateFromServer } from '@/locales';
import { BoxType, INotification } from '@/types/notification';
import { Iconify } from '@/components/iconify';
import { fDate } from '@/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  row: INotification;
  boxType: BoxType;
  onMarkDoneRow: () => Promise<void>;
};

export function NotificationTableRow({ row, boxType, onMarkDoneRow }: Props) {
  const confirmDialog = useBoolean();
  const [loading, setLoading] = useState(false);
  const { t: tCommon } = useTranslate('common');
  const { translations } = useTranslateFromServer();

  const dueDate = new Date(row.dueDate);
  const now = new Date();
  dueDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffMs = dueDate.getTime() - now.getTime();
  const diff = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  let bgColor = '#bbf7d0'; // green (future or today)
  if (diff < -2) {
    bgColor = '#fee2e2'; // red (very overdue)
  } else if (diff < 0) {
    bgColor = '#fef9c3'; // yellow (slightly overdue)
  }

  let notificationType = '';
  switch (row.notificationType) {
    case 1:
      notificationType = translations['Police'];
      break;
    case 2:
      notificationType = translations['SentToAction'];
      break;
    case 3:
      notificationType = translations['Deed'];
      break;
    case 4:
      notificationType = translations['Insurance'];
      break;
    case 5:
      notificationType = translations['Transport'];
      break;
    case 6:
      notificationType = translations['SentToMunicipality'];
      break;
    case 7:
      notificationType = translations['PlateRevokedDate'];
      break;
  }

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title={tCommon('notification.markAsDone')}
      content={tCommon('notification.markAsDoneText')}
      action={
        <Button
          variant="contained"
          color="error"
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await onMarkDoneRow();
            setLoading(false);
            confirmDialog.onFalse();
          }}
        >
          {tCommon('yes')}
        </Button>
      }
    />
  );

  return (
    <>
      <TableRow
        sx={{ backgroundColor: boxType === 'inbox' ? bgColor : null, cursor: 'pointer' }}
        onDoubleClick={() => window.open(paths.dashboard.car.edit(row.carId), '_blank')}
      >
        <TableCell>
          <Stack
            direction={'row'}
            alignItems={'center'}
            spacing={1}
            sx={{ minWidth: '150px' }}
          >
            <Stack>
              <Typography variant="body2">{row.carBrand}</Typography>
              <Typography variant="body2" color="textDisabled" mt={0.5}>
                {row.carModel} {row.carYear}-{row.carColor}
              </Typography>
            </Stack>
          </Stack>
        </TableCell>
        <TableCell>{notificationType}</TableCell>
        <TableCell sx={{ minWidth: '200px' }}>{row.message}</TableCell>
        <TableCell sx={{ minWidth: '120px' }}>{fDate(row.dueDate)}</TableCell>
        {row.isResolved && (
          <>
            <TableCell>{row.resolvedBy}</TableCell>
            <TableCell>{row.resolvedDate ? fDate(row.resolvedDate) : ''}</TableCell>
          </>
        )}
        <TableCell>{fDate(row.createdAt)}</TableCell>

        {!row.isResolved && (
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Mark as done" placement="top" arrow>
                <IconButton color="error" onClick={confirmDialog.onTrue}>
                  <Iconify icon="eva:done-all-fill" color="green" />
                </IconButton>
              </Tooltip>
            </Box>
          </TableCell>
        )}
      </TableRow>
      {renderConfirmDialog()}
    </>
  );
}
