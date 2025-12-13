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
import Loading from '@/app/dashboard/loading';
import { AuctionTableRow } from '../auction-table-row';
import { deleteAuction, useGetAuctions } from '@/actions/auction';
import { EmptyContent } from '@/components/empty-content';
import Stack from '@mui/material/Stack';
import { Scrollbar } from '@/components/scrollbar';
import { useTranslate, useTranslateFromServer } from '@/locales';

export function AuctionListView() {
  const { t: tCommon, currentLang } = useTranslate('common');
  const { formFields } = useTranslateFromServer();

  const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'auctionName', label: formFields['AuctionName'] },
    { id: 'auctionDate', label: formFields['AuctionDate'] },
    { id: 'auctionFee', label: formFields['AuctionFee'] },
    { id: 'createdAt', label: formFields['CreatedDate'] },
    { id: '', width: 88 },
  ];

  const { auctions, auctionsLoading, auctionsEmpty } = useGetAuctions(currentLang.value);

  const handleDeleteAuction = useCallback(async (auctionId: number) => {
    await deleteAuction(auctionId);
  }, []);

  const renderEmpty = () => (
    <Stack sx={{ flex: '1 1 auto', px: { xs: 2.5, md: 1.5 }, py: 8 }}>
      <EmptyContent title={tCommon('auction.noAuctions')} />
    </Stack>
  );

  const renderTable = () => (
    <Scrollbar sx={{ minHeight: 350 }}>
      <Table sx={{ minWidth: 700 }}>
        <TableHeadCustom headCells={TABLE_HEAD} />
        <TableBody>
          {auctions.map((row) => (
            <AuctionTableRow
              key={row.auctionId!}
              row={row}
              onDeleteRow={() => handleDeleteAuction(row.auctionId!)}
            />
          ))}
        </TableBody>
      </Table>
    </Scrollbar>
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={tCommon('list')}
          links={[
            { name: tCommon('dashboard'), href: paths.dashboard.root },
            { name: tCommon('auction.auction'), href: paths.dashboard.auction.root },
            { name: tCommon('list') },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.auction.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {tCommon('auction.addAuction')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {auctionsLoading ? (
          <Loading />
        ) : (
          <Card>{auctionsEmpty ? renderEmpty() : renderTable()}</Card>
        )}
      </DashboardContent>
    </>
  );
}
