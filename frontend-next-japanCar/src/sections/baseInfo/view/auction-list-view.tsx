'use client';

import { useTranslate, useTranslateFromServer } from '@/locales';
import { TableHeadCellProps } from '@/components/table';
import { BaseInfoItemListView } from './base-info-item-list-view';
import { deleteItem, getItemById, useList } from '@/actions/base-action';
import { endpoints } from '@/lib/axios';
import { fDate } from '@/utils/format-time';
import { IAuction } from '@/types/auction';
import { AuctionCreateEditForm } from '../auction-create-edit-form';

export function AuctionListView() {
  const { translations } = useTranslateFromServer();
  const { t: tCommon } = useTranslate('common');

  const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'auctionName', label: translations['AuctionName'] },
    { id: 'createdAt', label: translations['CreatedDate'] },
    { id: '', width: 88 },
  ];

  return (
    <BaseInfoItemListView<IAuction>
      headers={TABLE_HEAD}
      url={endpoints.baseInfo.auction}
      multilanguage={true}
      useGetData={useList<IAuction>}
      deleteItem={deleteItem}
      getItemById={getItemById<IAuction>}
      getRowId={(r: IAuction) => r.auctionId!}
      CreateEditForm={AuctionCreateEditForm}
      tableHead={[
        { key: 'auctionName', render: (r) => r.auctionName },
        { key: 'createdAt', render: (r) => fDate(r.createdAt) },
      ]}
      addLabel={tCommon('baseInfo.addAuction')}
      emptyLabel={tCommon('baseInfo.noAuctions')}
    />
  );
}