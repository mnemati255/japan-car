import { useBoolean } from 'minimal-shared/hooks';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Iconify } from '@/components/iconify';
import { ConfirmDialog } from '@/components/custom-dialog';
import { IModel } from '@/types/car';
import { allLangs, LangCode, useTranslate } from '@/locales';

// ----------------------------------------------------------------------

type Props = {
  row: IModel;
  onDeleteRow: () => void;
  onShowEditDialog: (locale?: LangCode) => void;
};

export function ModelTableRow({ row, onDeleteRow, onShowEditDialog }: Props) {
  const confirmDialog = useBoolean();
  const { currentLang, t:tCommon } = useTranslate('common');

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
      <TableRow key={row.modelId}>
        <TableCell>{row.modelName}</TableCell>
        <TableCell>{row.brandName}</TableCell>
        <TableCell>{row.createdAt?.split('T')[0]}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {allLangs
              .filter((x) => x.value !== currentLang.value)
              .map((x, i) => (
                <Tooltip key={`lng_${i}`} title={x.label} placement="top" arrow>
                  <IconButton onClick={() => onShowEditDialog(x.value)}>
                    <Iconify icon="custom:translation" />
                  </IconButton>
                </Tooltip>
              ))}
            <Tooltip title="Edit" placement="top" arrow>
              <IconButton color="warning" onClick={() => onShowEditDialog()}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
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
