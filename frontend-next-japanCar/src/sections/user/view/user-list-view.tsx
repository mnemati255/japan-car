'use client';

import type { TableHeadCellProps } from '@/components/table';
import { useCallback, useState } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';
import { DashboardContent } from '@/layouts/dashboard';
import { Iconify } from '@/components/iconify';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { TableHeadCustom } from '@/components/table';
import Loading from '@/app/dashboard/loading';
import { deleteUser, useGetUsers } from '@/actions/user';
import { UserTableRow } from '../user-table-row';
import { Scrollbar } from '@/components/scrollbar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useTranslate, useTranslateFromServer } from '@/locales';

// ----------------------------------------------------------------------

export function UserListView() {
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const { t: tCommon } = useTranslate('common');
  const {formFields} = useTranslateFromServer();

  const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'userName', label: formFields['UserName'] },
  { id: 'email', label: formFields['Email'] },
  { id: 'createdAt', label: formFields['CreatedDate'] },
  { id: 'isActive', label: formFields['IsActive'] },
  { id: '', width: 88 },
];

  const handleSearch = () => {
    setSearchKeyword(keyword);
  };

  const { users, isLoading } = useGetUsers(searchKeyword);

  const handleDeleteUser = useCallback(async (userId: number) => {
    await deleteUser(userId);
  }, []);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={tCommon('list')}
          links={[
            { name: tCommon('dashboard'), href: paths.dashboard.root },
            { name: tCommon('user.user'), href: paths.dashboard.user.root },
            { name: tCommon('list') },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.user.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {tCommon('user.addUser')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

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
          {isLoading ? (
            <Loading />
          ) : (
            <Scrollbar sx={{ minHeight: 350 }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHeadCustom headCells={TABLE_HEAD} />
                <TableBody>
                  {users.map((row) => (
                    <UserTableRow
                      key={row.userId!}
                      row={row}
                      onDeleteRow={() => handleDeleteUser(row.userId!)}
                    />
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          )}
        </Card>
      </DashboardContent>
    </>
  );
}
