'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { IAuction } from '@/types/auction';
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
import { useTranslate, useTranslateFromServer } from '@/locales';

// ----------------------------------------------------------------------

const DEFAULT_FILTERS = {
  brandId: '',
  colorId: '',
  modelId: '',
  year: '',
  chasisNumber: '',
  fuelType: '',
  month: '',
  transmissionType: '',
  plateType: '',
  plateNumber: '',
};

// ----------------------------------------------------------------------

type Props = {
  auctionId?: number;
};

export function CarListView({ auctionId }: Props) {
  const { translations: formFields } = useTranslateFromServer();

  const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'modelName', label: formFields['ModelName'] },
    { id: 'sukuraNumber', label: formFields['SukuraNumber'] },
    { id: 'purchasePrice', label: formFields['PurchasePrice'] },
    { id: 'finalPrice', label: formFields['FinalPrice'] },
    { id: 'createdAt', label: formFields['CreatedDate'] },
    { id: 'actions', width: 88 },
  ];

  const [currentAuction, setCurrentAuction] = useState<IAuction | null>(null);
  const [page, setPage] = useState(1);
  const searchDialog = useBoolean();
  const [filters, setFilters] = useState<any>(DEFAULT_FILTERS);
  const { currentLang, t: tCommon } = useTranslate('common');

  const { cars, totalPage, empty, isLoading } = useGetCars(
    currentLang.value,
    page,
    filters,
    auctionId
  );

  useEffect(() => {
    if (auctionId) {
      const getAuction = async () => {
        const { status, data } = await getAuctionById(auctionId, currentLang.value);
        if (status === 200) {
          setCurrentAuction(data);
        }
      };
      getAuction();
    }
  }, [auctionId, currentLang.value]);

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
      <EmptyContent title={tCommon('car.noCars')} />
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
          {tCommon('search')}
        </Button>
        {Object.keys(filters).some((k) => filters[k] !== (DEFAULT_FILTERS as any)[k]) && (
          <Button
            variant="soft"
            color="error"
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            {tCommon('clearFilters')}
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
    ? [
        { name: tCommon('dashboard'), href: paths.dashboard.root },
        { name: tCommon('car.cars'), href: paths.dashboard.car.root },
        { name: tCommon('list') },
      ]
    : [
        { name: tCommon('dashboard'), href: paths.dashboard.root },
        { name: currentAuction?.auctionName, href: paths.dashboard.auction.root },
        { name: tCommon('car.cars') },
      ];

  if (auctionId && !currentAuction) return null;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tCommon('list')}
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
            {tCommon('car.addCar')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {isLoading ? <Loading /> : <Card>{renderTable()}</Card>}

      {renderSearchDialog()}
    </DashboardContent>
  );
}
