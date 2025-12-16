'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { RouterLink } from '@/routes/components';
import { Iconify } from '@/components/iconify';
import Stack from '@mui/material/Stack';
import { EmptyContent } from '@/components/empty-content';
import Loading from '@/app/dashboard/loading';
import Card from '@mui/material/Card';
import { getCarById } from '@/actions/car';
import Table from '@mui/material/Table';
import { TableHeadCellProps, TableHeadCustom } from '@/components/table';
import { Scrollbar } from '@/components/scrollbar';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import { useBoolean } from 'minimal-shared/hooks';
import { useTranslate, useTranslateFromServer } from '@/locales';
import { ICar } from '@/types/car';
import { deleteItem, useGetPaginatedItems } from '@/actions/base-action';
import { IRepair } from '@/types/repair';
import { endpoints } from '@/lib/axios';
import TableBody from '@mui/material/TableBody';
import { RepairTableRow } from '../repair-table-row';

// ----------------------------------------------------------------------

const DEFAULT_FILTERS = {
  repairDate: '',
  mechanicId: '',
};

// ----------------------------------------------------------------------

type Props = {
  carId: number;
};

export function RepairsListView({ carId }: Props) {
  const { formFields } = useTranslateFromServer();

  const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'repairDate', label: formFields['RepairDate'] },
    { id: 'mechanicName', label: formFields['MechanicName'] },
    { id: 'createdAt', label: formFields['CreatedDate'] },
    { id: 'actions', width: 88 },
  ];

  const [currentCar, setCurrentCar] = useState<ICar | null>(null);
  const [page, setPage] = useState(1);
  const searchDialog = useBoolean();
  const [filters, setFilters] = useState<any>(DEFAULT_FILTERS);
  const { currentLang, t: tCommon } = useTranslate('common');

  const { items, totalPage, empty, isLoading } = useGetPaginatedItems<IRepair>(
    `${endpoints.repair}/${carId}`,
    page,
    null,
    currentLang.value,
    filters
  );

  useEffect(() => {
    if (carId) {
      const getCar = async () => {
        const { status, data } = await getCarById(carId);
        if (status === 200) {
          setCurrentCar(data);
        }
      };
      getCar();
    }
  }, [carId, currentLang.value]);

  const handleDeleteRepair = useCallback(async (repairId: number) => {
    await deleteItem(endpoints.repair, repairId);
  }, []);

  //   const renderSearchDialog = () => (
  //     <CarSearchDialog
  //       open={searchDialog.value}
  //       onClose={searchDialog.onFalse}
  //       onApplyFilters={(e) => {
  //         setFilters(e);
  //         searchDialog.onFalse();
  //         setPage(1);
  //       }}
  //       filters={filters}
  //     />
  //   );

  const renderEmpty = () => (
    <Stack sx={{ flex: '1 1 auto', px: { xs: 2.5, md: 1.5 }, py: 8 }}>
      <EmptyContent title={tCommon('repair.noRepairs')} />
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
              {items.map((row, index) => (
                <RepairTableRow
                  key={index}
                  row={row}
                  onDeleteRow={() => handleDeleteRepair(row.repairId!)}
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
        heading={tCommon('repair.repairs')}
        backHref={paths.dashboard.car.root}
        links={[
          { name: tCommon('dashboard'), href: paths.dashboard.root },
          { name: tCommon('car.cars'), href: paths.dashboard.car.root },
          { name: `${formFields['ChassisNumber']}: ${currentCar?.chasisNumber ?? ''}` },
          { name: tCommon('repair.repairs') },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.car.newRepair(carId)}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {tCommon('repair.addRepair')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {isLoading ? <Loading /> : <Card>{renderTable()}</Card>}

      {/* {renderSearchDialog()} */}
    </DashboardContent>
  );
}
