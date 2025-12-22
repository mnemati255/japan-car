'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import { RouterLink } from '@/routes/components';
import { Iconify } from '@/components/iconify';
import Stack from '@mui/material/Stack';
import { EmptyContent } from '@/components/empty-content';
import Loading from '@/app/dashboard/loading';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import { TableHeadCellProps, TableHeadCustom } from '@/components/table';
import TableBody from '@mui/material/TableBody';
import { Scrollbar } from '@/components/scrollbar';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import { useTranslate, useTranslateFromServer } from '@/locales';
import { deleteItem, useGetPaginatedItems } from '@/actions/base-action';
import { ICustomer } from '@/types/customer';
import { endpoints } from '@/lib/axios';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { CustomerTableRow } from '../customer-table-row';

// ----------------------------------------------------------------------

export function CustomerListView() {
  const { translations: formFields } = useTranslateFromServer();

  const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'firstName', label: formFields['FirstName'] },
    { id: 'lastName', label: formFields['LastName'] },
    { id: 'email', label: formFields['Email'] },
    { id: 'phone', label: formFields['Phone'] },
    { id: 'isActive', label: formFields['IsActive'] },
    { id: 'createdAt', label: formFields['CreatedDate'] },
    { id: 'actions', width: 88 },
  ];

  const [page, setPage] = useState(1);
  const { currentLang, t: tCommon } = useTranslate('common');
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = () => {
    setSearchKeyword(keyword);
  };

  const { items, totalPage, empty, isLoading } = useGetPaginatedItems<ICustomer>(
    endpoints.customer,
    page,
    searchKeyword,
    currentLang.value
  );

  const handleDeleteCustomer = useCallback(async (customerId: number) => {
    await deleteItem(endpoints.customer, customerId);
  }, []);

  const renderEmpty = () => (
    <Stack sx={{ flex: '1 1 auto', px: { xs: 2.5, md: 1.5 }, py: 8 }}>
      <EmptyContent title={tCommon('customer.noCustomers')} />
    </Stack>
  );

  const renderTable = () => (
    <>
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
          <Table sx={{ minWidth: 1000 }}>
            <TableHeadCustom headCells={TABLE_HEAD} />
            <TableBody>
              {items.map((row, index) => (
                <CustomerTableRow
                  key={index}
                  row={row}
                  onDeleteRow={() => handleDeleteCustomer(row.customerId!)}
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
    </>
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tCommon('list')}
        links={[
          { name: tCommon('dashboard'), href: paths.dashboard.root },
          { name: tCommon('customer.customers'), href: paths.dashboard.customer.root },
          { name: tCommon('list') },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.customer.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {tCommon('customer.addCustomer')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {isLoading ? <Loading /> : <Card>{renderTable()}</Card>}
    </DashboardContent>
  );
}
