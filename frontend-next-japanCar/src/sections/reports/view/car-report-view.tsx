'use client';

import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Iconify } from '@/components/iconify';
import Stack from '@mui/material/Stack';
import { EmptyContent } from '@/components/empty-content';
import Loading from '@/app/dashboard/loading';
import Card from '@mui/material/Card';
import { getCarReportExcel, getCarReportPdf } from '@/actions/car';
import Table from '@mui/material/Table';
import { TableHeadCellProps, TableHeadCustom } from '@/components/table';
import TableBody from '@mui/material/TableBody';
import { Scrollbar } from '@/components/scrollbar';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import { useBoolean } from 'minimal-shared/hooks';
import { useTranslate, useTranslateFromServer } from '@/locales';
import { CarReportTableRow } from '../car-report-table-row';
import CarReportSearchDialog from '../car-report-search-dialog';
import { ICar, ICarFilter } from '@/types/car';
import { useGetPaginatedItems } from '@/actions/base-action';
import { endpoints } from '@/lib/axios';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const DEFAULT_FILTERS: ICarFilter = {
  brandId: '',
  colorId: '',
  modelId: '',
  year: '',
  katashaki: '',
  chasisNumber: '',
  fuelType: '',
  transmissionType: '',
  plateType: '',
  plateNumber: '',
  purchaseDateFrom: '',
  purchaseDateTo: '',
  purchasePriceFrom: '',
  purchasePriceTo: '',
  hasPoliceCertificate: '',
  transportDateFrom: '',
  transportDateTo: '',
  policeCertificateReceivedDateFrom: '',
  policeCertificateReceivedDateTo: '',
  municipalitySentDateFrom: '',
  municipalitySentDateTo: '',
};

export function CarReportView() {
  const { translations } = useTranslateFromServer();

  const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'modelName', label: translations['ModelName'] },
    { id: 'purchaseDate', label: translations['PurchaseDate'] },
    { id: 'purchasePrice', label: translations['PurchasePrice'] },
    { id: 'finalPrice', label: translations['FinalPrice'] },
    { id: 'sukuraNumber', label: translations['SukuraNumber'] },
    { id: 'createdAt', label: translations['CreatedDate'] },
    { id: 'actions', width: 88 },
  ];

  const [page, setPage] = useState(1);
  const searchDialog = useBoolean();
  const [filters, setFilters] = useState<any>(DEFAULT_FILTERS);
  const { currentLang, t: tCommon } = useTranslate('common');
  const excelLoading = useBoolean();
  const pdfLoading = useBoolean();

  // const { cars, totalPage, empty, isLoading } = useGetCars(
  //   currentLang.value,
  //   page,
  //   filters
  // );

  const { items, totalPage, totalCount, empty, isLoading } = useGetPaginatedItems<ICar>(
    endpoints.car,
    page,
    null,
    currentLang.value,
    filters
  );

  const exportExcel = async () => {
    try {
      excelLoading.onTrue();
      await getCarReportExcel(filters);
      excelLoading.onFalse();
    } catch (error) {
      excelLoading.onFalse();
      throw error;
    }
  };

  const exportPdf = async () => {
    try {
      pdfLoading.onTrue();
      await getCarReportPdf(currentLang.value, filters);
      pdfLoading.onFalse();
    } catch (error) {
      pdfLoading.onFalse();
      throw error;
    }
  };

  const renderSearchDialog = () => (
    <CarReportSearchDialog
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
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          p: 2,
        }}
      >
        <Typography>
          {totalCount} {tCommon('records')}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            sx={{ backgroundColor: 'orangered' }}
            startIcon={<Iconify icon="solar:file-text-bold" />}
            loading={pdfLoading.value}
            onClick={exportPdf}
          >
            {tCommon('report.exportPdf')}
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<Iconify icon="solar:file-text-bold" />}
            loading={excelLoading.value}
            onClick={exportExcel}
          >
            {tCommon('report.exportExcel')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:search-fill" />}
            onClick={() => searchDialog.onTrue()}
          >
            {tCommon('search')}
          </Button>
          {Object.keys(filters).some(
            (k) => filters[k] !== (DEFAULT_FILTERS as any)[k]
          ) && (
            <Button
              variant="soft"
              color="error"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              {tCommon('clearFilters')}
            </Button>
          )}
        </Box>
      </Box>
      {empty ? (
        renderEmpty()
      ) : (
        <Scrollbar sx={{ minHeight: 350 }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHeadCustom headCells={TABLE_HEAD} />
            <TableBody>
              {items.map((row, index) => (
                <CarReportTableRow key={index} row={row} />
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
        heading={tCommon('report.report')}
        links={[
          { name: tCommon('dashboard'), href: paths.dashboard.root },
          { name: tCommon('report.reports') },
          { name: tCommon('car.cars') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {isLoading ? <Loading /> : <Card>{renderTable()}</Card>}

      {renderSearchDialog()}
    </DashboardContent>
  );
}
