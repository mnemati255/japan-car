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
import { allLangs, useTranslate } from '@/locales';
import { IRepair } from '@/types/repair';
import { fDate } from '@/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  row: IRepair;
  onDeleteRow: () => Promise<void>;
};

export function RepairTableRow({ row, onDeleteRow }: Props) {
  const confirmDialog = useBoolean();
  const [loading, setLoading] = useState(false);
  const { t: tCommon, currentLang } = useTranslate('common');

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
        <TableCell>{row.repairDate}</TableCell>
        <TableCell>{row.mechanicName}</TableCell>
        <TableCell>{fDate(row.createdAt)}</TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {allLangs
              .filter((x) => x.value !== currentLang.value)
              .map((x, i) => (
                <Tooltip key={`lng_${i}`} title={x.label} placement="top" arrow>
                  <RouterLink
                    href={`${paths.dashboard.car.editRepair(
                      row.carId,
                      row.repairId!
                    )}?lang=${x.value}`}
                  >
                    <IconButton>
                      <Iconify icon="custom:translation" />
                    </IconButton>
                  </RouterLink>
                </Tooltip>
              ))}
            <Tooltip title="Edit" placement="top" arrow>
              <RouterLink
                href={paths.dashboard.car.editRepair(row.carId!, row.repairId!)}
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
