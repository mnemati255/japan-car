'use client';

import { useTranslate, useTranslateFromServer } from '@/locales';
import { TableHeadCellProps } from '@/components/table';
import { BaseInfoItemListView } from './base-info-item-list-view';
import { IMechanic } from '@/types/mechanic';
import { deleteItem, getItemById, useList } from '@/actions/base-action';
import { endpoints } from '@/lib/axios';
import { MechanicCreateEditForm } from '../mechanic-create-edit-form';

export function MechanicListView() {
  const { translations: formFields } = useTranslateFromServer();
  const { t: tCommon } = useTranslate('common');

  const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'mechanicName', label: formFields['MechanicName'] },
    { id: 'contact', label: formFields['Contact'] },
    { id: 'createdAt', label: formFields['CreatedDate'] },
    { id: '', width: 88 },
  ];

  return (
    <BaseInfoItemListView<IMechanic>
      headers={TABLE_HEAD}
      url={endpoints.baseInfo.mechanic}
      multilanguage={false}
      useGetData={useList<IMechanic>}
      getItemById={getItemById<IMechanic>}
      deleteItem={deleteItem}
      getRowId={(r: IMechanic) => r.mechanicId!}
      CreateEditForm={MechanicCreateEditForm}
      tableHead={[
        { key: 'mechanicName', render: (r) => r.mechanicName },
        { key: 'contact', render: (r) => r.contact },
        { key: 'createdAt', render: (r) => r.createdAt?.split('T')[0] },
      ]}
      addLabel={tCommon('baseInfo.addMechanic')}
      emptyLabel={tCommon('baseInfo.noMechanics')}
    />
  );
}
