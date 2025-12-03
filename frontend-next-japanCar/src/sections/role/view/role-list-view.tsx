'use client';

import type { TableHeadCellProps } from '@/components/table';
import { useCallback } from 'react';
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
import { deleteRole, useGetRoles } from '@/actions/role';
import { RoleTableRow } from '../role-table-row';
import Loading from '@/app/dashboard/loading';
import { Scrollbar } from '@/components/scrollbar';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'roleName', label: 'Role name' },
  { id: 'createdAt', label: 'Created date' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function RoleListView() {
  const { roles, rolesLoading } = useGetRoles();

  const handleDeleteRole = useCallback(async (roleId: number) => {
    await deleteRole(roleId);
  }, []);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Role', href: paths.dashboard.role.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.role.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add role
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {rolesLoading ? (
          <Loading />
        ) : (
          <Card>
            <Scrollbar sx={{ minHeight: 350 }}>
              <Table sx={{ minWidth: 500 }}>
                <TableHeadCustom headCells={TABLE_HEAD} />
                <TableBody>
                  {roles.map((row) => (
                    <RoleTableRow
                      key={row.roleId!}
                      row={row}
                      onDeleteRow={() => handleDeleteRole(row.roleId!)}
                    />
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </Card>
        )}
      </DashboardContent>
    </>
  );
}
