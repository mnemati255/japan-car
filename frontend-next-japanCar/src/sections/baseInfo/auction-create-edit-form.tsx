import { createItem, updateItem } from '@/actions/base-action';
import { Field, Form } from '@/components/hook-form';
import { endpoints } from '@/lib/axios';
import { useMessage } from '@/lib/messages';
import { LangCode, useTranslate, useTranslateFromServer } from '@/locales';
import { IAuction } from '@/types/auction';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

type Props = {
  open: boolean;
  onClose: () => void;
  currentItem: IAuction | null;
  locale: LangCode;
};

export function AuctionCreateEditForm({ onClose, open, currentItem, locale }: Props) {
  const { currentLang, t: tCommon } = useTranslate('common');
  const { translations: formFields } = useTranslateFromServer();
  const { messages } = useMessage();

  const AuctionSchema = z.object({
    auctionName: z.string().min(1, { error: messages.required() }),
  });

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(AuctionSchema),
    defaultValues: {
      auctionName: currentItem?.auctionName ?? '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentItem) {
      reset({
        auctionName: currentItem.auctionName ?? '',
      });
    }
  }, [currentItem, open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const api = !currentItem
        ? createItem<IAuction>(endpoints.baseInfo.auction, data)
        : updateItem<IAuction>(
            endpoints.baseInfo.auction,
            currentItem.auctionId!,
            data,
            locale
          );
      const { status } = await api;
      if (status == 200) {
        onClose();
      }
    } catch (error) {
      throw error;
    }
  });

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>
        {currentItem
          ? locale == currentLang.value
            ? `${tCommon('update')} ${tCommon('baseInfo.auction')}`
            : tCommon('translation')
          : `${tCommon('create')} ${tCommon('baseInfo.auction')}`}
      </DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ py: 3, display: 'grid', rowGap: 3 }}>
          <Field.Text name="auctionName" label={formFields['AuctionName']} />

          <Stack sx={{ alignItems: 'end', mt: 3 }}>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              {!currentItem
                ? `${tCommon('create')} ${tCommon('baseInfo.auction')}`
                : tCommon('save')}
            </Button>
          </Stack>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
