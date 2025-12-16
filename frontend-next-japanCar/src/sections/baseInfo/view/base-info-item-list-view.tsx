import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Scrollbar } from '@/components/scrollbar';
import { EmptyContent } from '@/components/empty-content';
import { LangCode, useTranslate } from '@/locales';
import { BaseInfoItemTableRow } from '../base-info-item-table-row';
import { TableHeadCellProps, TableHeadCustom } from '@/components/table';
import { Iconify } from '@/components/iconify';
import Loading from '@/app/dashboard/loading';
import { AxiosResponse } from 'axios';

type Column<T> = {
  key: string;
  render: (row: T) => React.ReactNode;
};

type BaseListViewProps<T> = {
  headers: TableHeadCellProps[];
  url: string;
  useGetData: (
    url: string,
    page: number,
    keyword: string,
    locale: LangCode
  ) => {
    items: T[];
    totalPage: number;
    empty: boolean;
    isLoading: boolean;
  };
  deleteItem: (url: string, id: number) => Promise<void>;
  getItemById: (url: string, id: number, locale: LangCode) => Promise<AxiosResponse>;
  getRowId: (row: T) => number;
  CreateEditForm: React.ComponentType<any>;
  tableHead: Column<T>[];
  addLabel: string;
  emptyLabel: string;
  multilanguage: boolean;
};

export function BaseInfoItemListView<T>({
  headers,
  url,
  useGetData,
  deleteItem,
  getItemById,
  getRowId,
  CreateEditForm,
  tableHead,
  addLabel,
  emptyLabel,
  multilanguage,
}: BaseListViewProps<T>) {
  const { currentLang, t: tCommon } = useTranslate('common');
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [item, setItem] = useState<T | null>(null);
  const [currentLocale, setCurrentLocale] = useState<LangCode>(currentLang.value);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSearch = () => {
    setPage(1);
    setSearchKeyword(keyword);
  };

  const { items, totalPage, empty, isLoading } = useGetData(
    url,
    page,
    searchKeyword,
    currentLang.value
  );

  const handleDeleteRow = async (rowId: number) => {
    await deleteItem(url, rowId);
  };

  const handleShowEditDialog = async (row: T, locale?: LangCode) => {
    console.log(33, locale)
    if (locale) {
      setCurrentLocale(locale);
      const id =
        (row as any)?.brandId ||
        (row as any)?.modelId ||
        (row as any)?.colorId ||
        (row as any)?.partId ||
        (row as any)?.mechanicId;
      const { status, data }: any = await getItemById(url, id, locale);
      if (status === 200) setItem(data);
    } else {
      setItem(row);
    }
    setOpenDialog(true);
  };

  const renderTable = () => (
    <Card>
      <Box sx={{ p: 2, display: 'flex' }}>
        <TextField
          fullWidth
          placeholder={`${tCommon('search')} ...`}
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
        <Box sx={{ p: 3 }}>
          <EmptyContent title={tCommon(emptyLabel)} />
        </Box>
      ) : (
        <Scrollbar sx={{ minHeight: 350 }}>
          <Table>
            <TableHeadCustom headCells={headers} />
            <TableBody>
              {items.map((row, index) => (
                <BaseInfoItemTableRow
                  key={index}
                  row={row}
                  multilanguage={multilanguage}
                  columns={tableHead}
                  getRowId={getRowId}
                  onDeleteRow={() => handleDeleteRow(getRowId(row))}
                  onShowEditDialog={(locale) => handleShowEditDialog(row, locale)}
                />
              ))}
            </TableBody>
          </Table>

          <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              page={page}
              count={totalPage}
              onChange={(_, newPage) => setPage(newPage)}
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
            setOpenDialog(true);
          }}
        >
          {addLabel}
        </Button>
      </Box>

      {renderTable()}
      {openDialog && (
        <CreateEditForm
          open={openDialog}
          currentItem={item}
          locale={currentLocale}
          onClose={() => {
            setOpenDialog(false);
            setCurrentLocale(currentLang.value);
          }}
        />
      )}
    </Box>
  );
}
