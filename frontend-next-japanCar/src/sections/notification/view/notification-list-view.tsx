'use client';

import { useGetPaginatedItems } from '@/actions/base-action';
import Loading from '@/app/dashboard/loading';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { EmptyContent } from '@/components/empty-content';
import { Scrollbar } from '@/components/scrollbar';
import { TableHeadCellProps, TableHeadCustom } from '@/components/table';
import { DashboardContent } from '@/layouts/dashboard';
import { endpoints } from '@/lib/axios';
import { useTranslate, useTranslateFromServer } from '@/locales';
import { paths } from '@/routes/paths';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { useCallback, useState } from 'react';
import { NotificationTableRow } from '../notification-table-row';
import { INotification, BoxType } from '@/types/notification';
import { markNotificationAsDone } from '@/actions/notification';
import { capitalize } from '@/utils/utils';

type Props = {
  boxType: BoxType;
};

export function NotificationListView({ boxType }: Props) {
  const { t: tCommon, currentLang } = useTranslate('common');
  const { translations } = useTranslateFromServer();
  const [page, setPage] = useState(1);

  const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'car', label: capitalize(tCommon('car.car')) },
    { id: 'notificationType', label: translations['NotificationType'] },
    { id: 'message', label: translations['Message'] },
    { id: 'dueDate', label: translations['DueDate'] },
    { id: 'createdAt', label: translations['CreatedDate'] },
  ];
  if (boxType === 'resolved') {
    TABLE_HEAD.splice(4, 0, { id: 'resolvedBy', label: translations['ResolvedBy'] });
    TABLE_HEAD.splice(5, 0, { id: 'resolvedDate', label: translations['ResolvedDate'] });
  }
  if (boxType == 'inbox') {
    TABLE_HEAD.push({ id: '', width: 88 });
  }

  const { items, totalPage, empty, isLoading } = useGetPaginatedItems<INotification>(
    endpoints.notification,
    page,
    null,
    currentLang.value,
    { isResolved: boxType === 'resolved' }
  );

  const handleMarkAsDone = useCallback(async (notificationId: number) => {
    await markNotificationAsDone(notificationId);
  }, []);

  const renderEmpty = () => (
    <Stack sx={{ flex: '1 1 auto', px: { xs: 2.5, md: 1.5 }, py: 8 }}>
      <EmptyContent title={tCommon('notification.noNotifications')} />
    </Stack>
  );

  const renderTable = () => (
    <>
      {empty ? (
        renderEmpty()
      ) : (
        <Scrollbar sx={{ minHeight: 350 }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHeadCustom headCells={TABLE_HEAD} />
            <TableBody>
              {items.map((row, index) => (
                <NotificationTableRow
                  key={index}
                  row={row}
                  boxType={boxType}
                  onMarkDoneRow={() => handleMarkAsDone(row.notificationId!)}
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
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={tCommon('list')}
          links={[
            { name: tCommon('dashboard'), href: paths.dashboard.root },
            {
              name: tCommon('notification.notifications'),
            },
            {
              name: tCommon(
                boxType === 'inbox' ? 'notification.inbox' : 'notification.resolved'
              ),
            },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {isLoading ? <Loading /> : <Card>{renderTable()}</Card>}
      </DashboardContent>
    </>
  );
}
