'use client';

import { useTranslate, useTranslateFromServer } from '@/locales';
import { TableHeadCellProps } from '@/components/table';
import { BrandCreateEditForm } from '../brand-create-edit-form';
import { BaseInfoItemListView } from './base-info-item-list-view';
import { IBrand } from '@/types/car';
import { endpoints } from '@/lib/axios';
import { deleteItem, getItemById, useList } from '@/actions/base-action';

export function BrandListView() {
  const { translations: formFields } = useTranslateFromServer();
  const { t: tCommon } = useTranslate('common');

  const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'brandName', label: formFields['BrandName'] },
    { id: 'createdAt', label: formFields['CreatedDate'] },
    { id: '', width: 88 },
  ];

  return (
    <BaseInfoItemListView<IBrand>
      headers={TABLE_HEAD}
      url={endpoints.baseInfo.brand}
      multilanguage={true}
      useGetData={useList<IBrand>}
      deleteItem={deleteItem}
      getItemById={getItemById<IBrand>}
      getRowId={(r: IBrand) => r.brandId!}
      CreateEditForm={BrandCreateEditForm}
      tableHead={[
        { key: 'brandName', render: (r) => r.brandName },
        { key: 'createdAt', render: (r) => r.createdAt?.split('T')[0] },
      ]}
      addLabel={tCommon('baseInfo.addBrand')}
      emptyLabel={tCommon('baseInfo.noBrands')}
    />
  );
}

// import { Iconify } from '@/components/iconify';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import { useBoolean } from 'minimal-shared/hooks';
// import { BrandCreateEditForm } from '../brand-create-edit-form';
// import { deleteBrand, getBrandById, useGetBrands } from '@/actions/base-info';
// import Loading from '@/app/dashboard/loading';
// import { Scrollbar } from '@/components/scrollbar';
// import Table from '@mui/material/Table';
// import { TableHeadCellProps, TableHeadCustom } from '@/components/table';
// import TableBody from '@mui/material/TableBody';
// import Stack from '@mui/material/Stack';
// import { EmptyContent } from '@/components/empty-content';
// import Card from '@mui/material/Card';
// import { BrandTableRow } from '../brand-tabel-row';
// import { useCallback, useState } from 'react';
// import { IBrand } from '@/types/car';
// import Pagination from '@mui/material/Pagination';
// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
// import { LangCode, useTranslate, useTranslateFromServer } from '@/locales';

// export function BrandListView() {
//   const formDialog = useBoolean();
//   const [item, setItem] = useState<IBrand | null>(null);
//   const { currentLang, t: tCommon } = useTranslate('common');
//   const { formFields } = useTranslateFromServer();
//   const [currentLocale, setCurrentLocale] = useState<LangCode>(currentLang.value);
//   const [page, setPage] = useState(1);
//   const [keyword, setKeyword] = useState('');
//   const [searchKeyword, setSearchKeyword] = useState('');

//   const TABLE_HEAD: TableHeadCellProps[] = [
//     { id: 'brandName', label: formFields['BrandName'] },
//     { id: 'createdAt', label: formFields['CreatedDate'] },
//     { id: '', width: 88 },
//   ];

//   const handleSearch = () => {
//     setPage(1);
//     setSearchKeyword(keyword);
//   };

//   const { brands, totalPage, empty, isLoading } = useGetBrands(
//     currentLang.value,
//     page,
//     searchKeyword
//   );

//   const handleDeleteRow = useCallback(async (brandId: number) => {
//     await deleteBrand(brandId);
//   }, []);

//   const handleShowEditDialog = useCallback(
//     async (brand: IBrand, locale?: LangCode) => {
//       if (locale) {
//         setCurrentLocale(locale);
//         const { status, data } = await getBrandById(locale, brand.brandId!);
//         if (status == 200) {
//           setItem(data);
//         }
//       } else {
//         setItem(brand);
//       }
//       formDialog.onTrue();
//     },
//     [formDialog]
//   );

//   const renderFormDialog = () => (
//     <BrandCreateEditForm
//       open={formDialog.value}
//       onClose={() => {
//         formDialog.onFalse();
//         setTimeout(() => {
//           setCurrentLocale(currentLang.value);
//         }, 200);
//       }}
//       currentItem={item}
//       locale={currentLocale}
//     />
//   );

//   const renderEmpty = () => (
//     <Stack sx={{ flex: '1 1 auto', px: { xs: 2.5, md: 1.5 }, py: 8 }}>
//       <EmptyContent title={tCommon('baseInfo.noBrands')} />
//     </Stack>
//   );

//   const renderTable = () => (
//     <Card>
//       <Box sx={{ p: 2, display: 'flex' }}>
//         <TextField
//           fullWidth
//           placeholder={`${tCommon('search')} ...`}
//           value={keyword}
//           onChange={(e) => setKeyword(e.target.value)}
//           slotProps={{
//             input: {
//               sx: {
//                 borderTopRightRadius: 0,
//                 borderBottomRightRadius: 0,
//               },
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
//                 </InputAdornment>
//               ),
//               endAdornment: keyword ? (
//                 <InputAdornment position="end">
//                   <Iconify
//                     icon="mingcute:close-line"
//                     sx={{ color: 'text.disabled', cursor: 'pointer' }}
//                     onClick={() => {
//                       setPage(1);
//                       setKeyword('');
//                       setSearchKeyword('');
//                     }}
//                   />
//                 </InputAdornment>
//               ) : null,
//             },
//           }}
//         />
//         <Button
//           variant="soft"
//           sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
//           onClick={handleSearch}
//         >
//           <Iconify icon="eva:search-fill" />
//         </Button>
//       </Box>

//       {empty ? (
//         renderEmpty()
//       ) : (
//         <Scrollbar sx={{ minHeight: 350 }}>
//           <Table sx={{ minWidth: 500 }}>
//             <TableHeadCustom headCells={TABLE_HEAD} />
//             <TableBody>
//               {brands.map((brand) => (
//                 <BrandTableRow
//                   key={brand.brandId}
//                   row={brand}
//                   onDeleteRow={() => handleDeleteRow(brand.brandId!)}
//                   onShowEditDialog={(locale) => handleShowEditDialog(brand, locale)}
//                 />
//               ))}
//             </TableBody>
//           </Table>

//           <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
//             <Pagination
//               page={page}
//               count={totalPage}
//               onChange={(event, newPage) => setPage(newPage)}
//             />
//           </Box>
//         </Scrollbar>
//       )}
//     </Card>
//   );

//   if (isLoading) {
//     return <Loading />;
//   }

//   return (
//     <Box p={3}>
//       <Box display={'flex'} justifyContent={'end'} mb={3}>
//         <Button
//           variant="contained"
//           startIcon={<Iconify icon="mingcute:add-line" />}
//           onClick={() => {
//             setItem(null);
//             formDialog.onTrue();
//           }}
//         >
//           {tCommon('baseInfo.addBrand')}
//         </Button>
//       </Box>

//       {renderTable()}
//       {renderFormDialog()}
//     </Box>
//   );
// }
