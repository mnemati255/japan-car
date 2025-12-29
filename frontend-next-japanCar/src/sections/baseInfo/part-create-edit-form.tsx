import { createItem, updateItem } from '@/actions/base-action';
import { Field, Form } from '@/components/hook-form';
import { endpoints } from '@/lib/axios';
import { useMessage } from '@/lib/messages';
import { LangCode, useTranslate, useTranslateFromServer } from '@/locales';
import { IPart } from '@/types/part';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

type Props = {
  open: boolean;
  onClose: () => void;
  currentItem: IPart | null;
  locale: LangCode;
};

export function PartCreateEditForm({ onClose, open, currentItem, locale }: Props) {
  const { currentLang, t: tCommon } = useTranslate('common');
  const { translations: formFields } = useTranslateFromServer();
  const { messages } = useMessage();

  const PartSchema = z.object({
    partPrice: z.coerce.number().min(1, { error: messages.required() }),
    partName: z.string().min(1, { error: messages.required() }),
    partDescription: z.string().nullable().optional(),
  });

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(PartSchema),
    defaultValues: {
      partPrice: '',
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
        partPrice: currentItem.partPrice,
        partName: currentItem.partName,
        partDescription: currentItem.partDescription,
      });
    } else {
      setTimeout(() => {
        reset({ partPrice: '', partName: '', partDescription: '' });
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
        <DialogContent sx={{ py: 3, display: 'grid', rowGap: 3 }}>
          <Field.Text
            name="partPrice"
            label={formFields['PartPrice']}
            type="number"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>¥</Box>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Field.Text name="partName" label={formFields['PartName']} />

          <Field.Text
            name="partDescription"
            label={formFields['PartDescription']}
            multiline={true}
            rows={2}
          />

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
