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

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'auctionName', label: 'Name' },
  { id: 'auctionDate', label: 'Date' },
  { id: 'auctionFee', label: 'Fee' },
  { id: 'createdAt', label: 'Created date' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function AuctionListView() {
  const { auctions, auctionsLoading, auctionsEmpty } = useGetAuctions();

  const handleDeleteAuction = useCallback(async (auctionId: number) => {
    await deleteAuction(auctionId);
  }, []);

  const renderEmpty = () => (
    <Stack sx={{ flex: '1 1 auto', px: { xs: 2.5, md: 1.5 }, py: 8 }}>
      <EmptyContent title="No auctions" />
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
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Auction', href: paths.dashboard.auction.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.auction.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add auction
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
