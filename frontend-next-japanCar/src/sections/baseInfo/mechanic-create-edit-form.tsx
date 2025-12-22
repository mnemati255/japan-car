import { createItem, updateItem } from '@/actions/base-action';
import { Field, Form } from '@/components/hook-form';
import { endpoints } from '@/lib/axios';
import messages from '@/lib/messages';
import { LangCode, useTranslate, useTranslateFromServer } from '@/locales';
import { IMechanic } from '@/types/mechanic';
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
  mechanicName: z.string().min(1, { error: messages.required() }),
  contact: z.coerce.string().nullable().optional(),
});

type Props = {
  open: boolean;
  onClose: () => void;
  currentItem: IMechanic | null;
  locale: LangCode;
};

export function MechanicCreateEditForm({ onClose, open, currentItem, locale }: Props) {
  const { currentLang, t: tCommon } = useTranslate('common');
  const { translations: formFields } = useTranslateFromServer();

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(PartSchema),
    defaultValues: {
      mechanicName: '',
      contact: '',
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
        mechanicName: currentItem.mechanicName,
        contact: currentItem.contact,
      });
    } else {
      setTimeout(() => {
        reset({ mechanicName: '', contact: '' });
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const api = !currentItem
        ? createItem<IMechanic>(endpoints.baseInfo.mechanic, data)
        : updateItem<IMechanic>(endpoints.baseInfo.mechanic, currentItem.mechanicId!, data);
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
            ? `${tCommon('update')} ${tCommon('baseInfo.mechanic')}`
            : tCommon('translation')
          : `${tCommon('create')} ${tCommon('baseInfo.mechanic')}`}
      </DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ py: 3, display: 'grid', rowGap: 3 }}>
          <Field.Text name="mechanicName" label={formFields['MechanicName']} />

          <Field.Text name="contact" label={formFields['Contact']} type="number" />

          <Stack sx={{ alignItems: 'end', mt: 3 }}>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              {!currentItem
                ? `${tCommon('create')} ${tCommon('baseInfo.mechanic')}`
                : tCommon('save')}
            </Button>
          </Stack>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
