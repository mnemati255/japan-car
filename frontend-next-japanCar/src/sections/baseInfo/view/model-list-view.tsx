'use client';

import { TableHeadCellProps } from '@/components/table';
import { useTranslate, useTranslateFromServer } from '@/locales';
import { BaseInfoItemListView } from './base-info-item-list-view';
import { IModel } from '@/types/car';
import { ModelCreateEditForm } from '../model-create-edit-form';
import { deleteItem, getItemById, useList } from '@/actions/base-action';
import { endpoints } from '@/lib/axios';

export function ModelListView() {
  const { translations: formFields } = useTranslateFromServer();
  const { t: tCommon } = useTranslate('common');

  const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'modelName', label: formFields['ModelName'] },
    { id: 'brandName', label: formFields['BrandName'] },
    { id: 'createdAt', label: formFields['CreatedDate'] },
    { id: '', width: 88 },
  ];

  return (
    <BaseInfoItemListView<IModel>
      headers={TABLE_HEAD}
      url={endpoints.baseInfo.model}
      multilanguage={true}
      useGetData={useList<IModel>}
      deleteItem={deleteItem}
      getItemById={getItemById<IModel>}
      getRowId={(r: IModel) => r.modelId!}
      CreateEditForm={ModelCreateEditForm}
      tableHead={[
        { key: 'modelName', render: (r) => r.modelName },
        { key: 'brandName', render: (r) => r.brandName },
        { key: 'createdAt', render: (r) => r.createdAt?.split('T')[0] },
      ]}
      addLabel={tCommon('baseInfo.addModel')}
      emptyLabel={tCommon('baseInfo.noModels')}
    />
  );
}

// import { Iconify } from '@/components/iconify';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import { useBoolean } from 'minimal-shared/hooks';
// import { deleteModel, getModelById, useGetModels } from '@/actions/base-info';
// import Loading from '@/app/dashboard/loading';
// import { Scrollbar } from '@/components/scrollbar';
// import Table from '@mui/material/Table';
// import { TableHeadCellProps, TableHeadCustom } from '@/components/table';
// import TableBody from '@mui/material/TableBody';
// import Stack from '@mui/material/Stack';
// import { EmptyContent } from '@/components/empty-content';
// import Card from '@mui/material/Card';
// import { useCallback, useState } from 'react';
// import { IModel } from '@/types/car';
// import { ModelTableRow } from '../model-table-row';
// import { ModelCreateEditForm } from '../model-create-edit-form';
// import Pagination from '@mui/material/Pagination';
// import InputAdornment from '@mui/material/InputAdornment';
// import TextField from '@mui/material/TextField';
// import { LangCode, useTranslate, useTranslateFromServer } from '@/locales';

// export function ModelListView() {
//   const formDialog = useBoolean();
//   const [item, setItem] = useState<IModel | null>(null);
//   const { currentLang, t: tCommon } = useTranslate('common');
//   const { formFields } = useTranslateFromServer();
//   const [currentLocale, setCurrentLocale] = useState<LangCode>(currentLang.value);
//   const [page, setPage] = useState(1);
//   const [keyword, setKeyword] = useState('');
//   const [searchKeyword, setSearchKeyword] = useState('');

// const TABLE_HEAD: TableHeadCellProps[] = [
//   { id: 'modelName', label: formFields['ModelName'] },
//   { id: 'brandName', label: formFields['BrandName'] },
//   { id: 'createdAt', label: formFields['CreatedDate'] },
//   { id: '', width: 88 },
// ];

//   const handleSearch = () => {
//     setPage(1);
//     setSearchKeyword(keyword);
//   };

//   const { models, totalPage, empty, isLoading } = useGetModels(
//     currentLang.value,
//     page,
//     searchKeyword
//   );

//   const handleDeleteRow = useCallback(async (modelId: number) => {
//     await deleteModel(modelId);
//   }, []);

//   const handleShowEditDialog = useCallback(
//     async (model: IModel, locale?: LangCode) => {
//       if (locale) {
//         setCurrentLocale(locale);
//         const { status, data } = await getModelById(locale, model.modelId!);
//         if (status == 200) {
//           setItem(data);
//           formDialog.onTrue();
//         }
//       } else {
//         setItem(model);
//         formDialog.onTrue();
//       }
//     },
//     [formDialog]
//   );

//   const renderFormDialog = () => (
//     <ModelCreateEditForm
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
//       <EmptyContent title={tCommon('baseInfo.noModels')} />
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
//               {models.map((model) => (
//                 <ModelTableRow
//                   key={model.modelId}
//                   row={model}
//                   onDeleteRow={() => handleDeleteRow(model.modelId!)}
//                   onShowEditDialog={(locale) => handleShowEditDialog(model, locale)}
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
//           {tCommon('baseInfo.addModel')}
//         </Button>
//       </Box>

//       {renderTable()}
//       {renderFormDialog()}
//     </Box>
//   );
// }
