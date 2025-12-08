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
import { deleteCar, useGetCars } from '@/actions/car';
import Table from '@mui/material/Table';
import { TableHeadCellProps, TableHeadCustom } from '@/components/table';
import TableBody from '@mui/material/TableBody';
import { Scrollbar } from '@/components/scrollbar';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import { useBoolean } from 'minimal-shared/hooks';
import { CarTableRow } from '../car-table-row';
import CarSearchDialog from '../car-search-dialog';

// ----------------------------------------------------------------------

const DEFAULT_FILTERS = {
  brandId: '',
  colorId: '',
  modelId: '',
  year: '',
  chasisNumber: '',
  fuelType: '',
};

// ----------------------------------------------------------------------

type Props = {
  auctionId?: number;
};

export function CarsListView({ auctionId }: Props) {
  const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'modelName', label: 'Model' },
    { id: 'purchasePrice', label: 'Purchase price' },
    { id: 'finalPrice', label: 'Final price' },
    { id: 'createdAt', label: 'Date' },
    { id: 'actions', width: 88 },
  ];
  if (!auctionId)
    TABLE_HEAD.splice(1, 0, {
      id: 'auctionName',
      label: 'Auction',
    });

  const [currentAuction, setCurrentAuction] = useState<IAuctionItem | null>(null);
  const [page, setPage] = useState(1);
  const searchDialog = useBoolean();
  const [filters, setFilters] = useState<any>(DEFAULT_FILTERS);

  const { cars, totalPage, empty, isLoading } = useGetCars(page, filters, auctionId);

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

  const handleDeleteCar = useCallback(async (carId: number) => {
    await deleteCar(carId);
  }, []);

  const renderSearchDialog = () => (
    <CarSearchDialog
      open={searchDialog.value}
      onClose={searchDialog.onFalse}
      onApplyFilters={(e) => {
        setFilters(e);
        searchDialog.onFalse();
        setPage(1);
      }}
      filters={filters}
    />
  );

  const renderEmpty = () => (
    <Stack sx={{ flex: '1 1 auto', px: { xs: 2.5, md: 1.5 }, py: 8 }}>
      <EmptyContent title="No cars" />
    </Stack>
  );

  const renderTable = () => (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          gap: 1,
          p: 2,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<Iconify icon="eva:search-fill" />}
          onClick={() => searchDialog.onTrue()}
        >
          Search
        </Button>
        {Object.keys(filters).some((k) => filters[k] !== (DEFAULT_FILTERS as any)[k]) && (
          <Button
            variant="soft"
            color="error"
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            Clear filters
          </Button>
        )}
      </Box>
      {empty ? (
        renderEmpty()
      ) : (
        <Scrollbar sx={{ minHeight: 350 }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHeadCustom headCells={TABLE_HEAD} />
            <TableBody>
              {cars.map((row, index) => (
                <CarTableRow
                  key={index}
                  auctionId={auctionId ?? null}
                  row={row}
                  onDeleteRow={() => handleDeleteCar(row.carId!)}
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

  const links = !auctionId
    ? [{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Cars' }]
    : [
        { name: 'Dashboard', href: paths.dashboard.root },
        { name: currentAuction?.auctionName, href: paths.dashboard.auction.root },
        { name: 'Cars' },
      ];

  if (auctionId && !currentAuction) return null;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Cars"
        backHref={paths.dashboard.car.root}
        links={links}
        action={
          <Button
            component={RouterLink}
            href={
              !auctionId
                ? paths.dashboard.car.new
                : paths.dashboard.auction.newCar(auctionId)
            }
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add car
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {isLoading ? <Loading /> : <Card>{renderTable()}</Card>}

      {renderSearchDialog()}
    </DashboardContent>
  );
}
