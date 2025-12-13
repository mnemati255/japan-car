import { Iconify } from '@/components/iconify';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useBoolean } from 'minimal-shared/hooks';
import { deleteColor, getColorById, useGetColors } from '@/actions/base-info';
import Loading from '@/app/dashboard/loading';
import { Scrollbar } from '@/components/scrollbar';
import Table from '@mui/material/Table';
import { TableHeadCellProps, TableHeadCustom } from '@/components/table';
import TableBody from '@mui/material/TableBody';
import Stack from '@mui/material/Stack';
import { EmptyContent } from '@/components/empty-content';
import Card from '@mui/material/Card';
import { useCallback, useState } from 'react';
import { IColor } from '@/types/car';
import { ColorCreateEditForm } from '../color-create-edit-form';
import { ColorTableRow } from '../color-table-row';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { LangCode, useTranslate } from '@/locales';

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'colorName', label: 'Color' },
  { id: 'createdAt', label: 'Created date' },
  { id: '', width: 88 },
];

export function ColorListView() {
  const formDialog = useBoolean();
  const [item, setItem] = useState<IColor | null>(null);
  const { currentLang } = useTranslate();
  const [currentLocale, setCurrentLocale] = useState<LangCode>(currentLang.value);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = () => {
    setPage(1);
    setSearchKeyword(keyword);
  };

  const { colors, totalPage, empty, isLoading } = useGetColors(
    currentLang.value,
    page,
    searchKeyword
  );

  const handleDeleteRow = useCallback(async (colorId: number) => {
    await deleteColor(colorId);
  }, []);

  const handleShowEditDialog = useCallback(
    async (color: IColor, locale?: LangCode) => {
      if (locale) {
        setCurrentLocale(locale);
        const { status, data } = await getColorById(locale, color.colorId!);
        if (status == 200) {
          setItem(data);
          formDialog.onTrue();
        }
      } else {
        setItem(color);
        formDialog.onTrue();
      }
    },
    [formDialog]
  );

  const renderFormDialog = () => (
    <ColorCreateEditForm
      open={formDialog.value}
      onClose={() => {
        formDialog.onFalse();
        setTimeout(() => {
          setCurrentLocale(currentLang.value);
        }, 200);
      }}
      currentItem={item}
      locale={currentLocale}
    />
  );

  const renderEmpty = () => (
    <Stack sx={{ flex: '1 1 auto', px: { xs: 2.5, md: 1.5 }, py: 8 }}>
      <EmptyContent title="No colors" />
    </Stack>
  );

  const renderTable = () => (
    <Card>
      <Box sx={{ p: 2, display: 'flex' }}>
        <TextField
          fullWidth
          placeholder="Search ..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          slotProps={{
            input: {
              sx: {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: keyword ? (
                <InputAdornment position="end">
                  <Iconify
                    icon="mingcute:close-line"
                    sx={{ color: 'text.disabled', cursor: 'pointer' }}
                    onClick={() => {
                      setPage(1);
                      setKeyword('');
                      setSearchKeyword('');
                    }}
                  />
                </InputAdornment>
              ) : null,
            },
          }}
        />
        <Button
          variant="soft"
          sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          onClick={handleSearch}
        >
          <Iconify icon="eva:search-fill" />
        </Button>
      </Box>

      {empty ? (
        renderEmpty()
      ) : (
        <Scrollbar sx={{ minHeight: 350 }}>
          <Table sx={{ minWidth: 500 }}>
            <TableHeadCustom headCells={TABLE_HEAD} />
            <TableBody>
              {colors.map((color) => (
                <ColorTableRow
                  key={color.colorId}
                  row={color}
                  onDeleteRow={() => handleDeleteRow(color.colorId!)}
                  onShowEditDialog={(locale) => handleShowEditDialog(color, locale)}
                />
              ))}
            </TableBody>
          </Table>

          <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              page={page}
              count={totalPage}
              onChange={(event, newPage) => setPage(newPage)}
            />
          </Box>
        </Scrollbar>
      )}
    </Card>
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box p={3}>
      <Box display={'flex'} justifyContent={'end'} mb={3}>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => {
            setItem(null);
            formDialog.onTrue();
          }}
        >
          Add color
        </Button>
      </Box>

      {renderTable()}
      {renderFormDialog()}
    </Box>
  );
}
