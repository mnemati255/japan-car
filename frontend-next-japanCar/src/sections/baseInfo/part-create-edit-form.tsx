import { createItem, updateItem } from '@/actions/base-action';
import { Field, Form } from '@/components/hook-form';
import { endpoints } from '@/lib/axios';
import messages from '@/lib/messages';
import { LangCode, useTranslate, useTranslateFromServer } from '@/locales';
import { IPart } from '@/types/part';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const PartSchema = z.object({
  partName: z.string().min(1, { error: messages.required() }),
  partDescription: z.string().nullable().optional(),
});

type Props = {
  open: boolean;
  onClose: () => void;
  currentItem: IPart | null;
  locale: LangCode;
};

export function PartCreateEditForm({ onClose, open, currentItem, locale }: Props) {
  const { currentLang, t: tCommon } = useTranslate('common');
  const { formFields } = useTranslateFromServer();

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(PartSchema),
    defaultValues: {
      partName: '',
      partDescription: '',
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
        partName: currentItem.partName,
        partDescription: currentItem.partDescription,
      });
    } else {
      setTimeout(() => {
        reset({ partName: '', partDescription: '' });
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const api = !currentItem
        ? createItem<IPart>(endpoints.baseInfo.part, data)
        : updateItem<IPart>(endpoints.baseInfo.part, currentItem.partId!, data, locale);
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
            ? `${tCommon('update')} ${tCommon('baseInfo.part')}`
            : tCommon('translation')
          : `${tCommon('create')} ${tCommon('baseInfo.part')}`}
      </DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ py: 3 }}>
          <Field.Text name="partName" label={formFields['PartName']} />

          <Stack sx={{ alignItems: 'end', mt: 3 }}>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              {!currentItem
                ? `${tCommon('create')} ${tCommon('baseInfo.part')}`
                : tCommon('save')}
            </Button>
          </Stack>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
