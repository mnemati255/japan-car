'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { IAuctionItem } from '@/types/auction';
import { useCallback, useEffect, useState } from 'react';
import { getAuctionById } from '@/actions/auction';
import Button from '@mui/material/Button';
import { RouterLink } from '@/routes/components';
import { Iconify } from '@/components/iconify';
import Stack from '@mui/material/Stack';
import { EmptyContent } from '@/components/empty-content';
import Loading from '@/app/dashboard/loading';
import Card from '@mui/material/Card';
import { deleteCarOfAuction, useGetCarsOfAuction } from '@/actions/car';
import Table from '@mui/material/Table';
import { TableHeadCellProps, TableHeadCustom } from '@/components/table';
import TableBody from '@mui/material/TableBody';
import { AuctionCarTableRow } from '../auction-car-table-row';
import { Scrollbar } from '@/components/scrollbar';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'modelName', label: 'Model' },
  { id: 'purchasePrice', label: 'Purchase price' },
  { id: 'finalPrice', label: 'Final price' },
  { id: 'createdAt', label: 'Date' },
  { id: 'actions', width: 88 },
];

// ----------------------------------------------------------------------

type Props = {
  auctionId: number;
};

export function AuctionCarsListView({ auctionId }: Props) {
  const [currentAuction, setCurrentAuction] = useState<IAuctionItem | null>(null);
  const { cars, empty, isLoading } = useGetCarsOfAuction(auctionId);

  useEffect(() => {
    if (auctionId) {
      const getAuction = async () => {
        const { status, data } = await getAuctionById(auctionId);
        if (status === 200) {
          setCurrentAuction(data);
        }
      };
      getAuction();
    }
  }, [auctionId]);

  const handleDeleteCar = useCallback(async (carId: number, auctionId: number) => {
    await deleteCarOfAuction(carId, auctionId);
  }, []);

  const renderEmpty = () => (
    <Stack sx={{ flex: '1 1 auto', px: { xs: 2.5, md: 1.5 }, py: 8 }}>
      <EmptyContent title="No cars" />
    </Stack>
  );

  const renderTable = () => (
    <Scrollbar sx={{ minHeight: 350 }}>
      <Table sx={{ minWidth: 800 }}>
        <TableHeadCustom headCells={TABLE_HEAD} />
        <TableBody>
          {cars.map((row) => (
            <AuctionCarTableRow
              key={row.carId}
              row={row}
              onDeleteRow={() => handleDeleteCar(row.carId!, row.auctionId!)}
            />
          ))}
        </TableBody>
      </Table>
    </Scrollbar>
  );

  if (!currentAuction) return null;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Cars"
        backHref={paths.dashboard.auction.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: currentAuction?.auctionName, href: paths.dashboard.auction.root },
          { name: 'Cars' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.auction.newCar(auctionId)}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add car
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {isLoading ? <Loading /> : <Card>{empty ? renderEmpty() : renderTable()}</Card>}
    </DashboardContent>
  );
}
