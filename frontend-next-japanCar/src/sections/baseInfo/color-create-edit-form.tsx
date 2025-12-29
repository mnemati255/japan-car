import { createItem, updateItem } from '@/actions/base-action';
import { Field, Form } from '@/components/hook-form';
import { endpoints } from '@/lib/axios';
import { useMessage } from '@/lib/messages';
import { LangCode, useTranslate, useTranslateFromServer } from '@/locales';
import { IColor } from '@/types/car';
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
  currentItem: IColor | null;
  locale: LangCode;
};

export function ColorCreateEditForm({ onClose, open, currentItem, locale }: Props) {
  const { currentLang, t: tCommon } = useTranslate('common');
  const { translations: formFields } = useTranslateFromServer();
  const {messages} = useMessage();

  const ColorSchema = z.object({
  colorName: z.string().min(1, { error: messages.required() }),
});

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ColorSchema),
    defaultValues: {
      colorName: '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentItem) {
      reset({ colorName: currentItem.colorName });
    } else {
      setTimeout(() => {
        reset({ colorName: '' });
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const api = !currentItem
        ? createItem<IColor>(endpoints.baseInfo.color, data)
        : updateItem<IColor>(
            endpoints.baseInfo.color,
            currentItem.colorId!,
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
            ? `${tCommon('update')} ${tCommon('baseInfo.color')}`
            : tCommon('translation')
          : `${tCommon('create')} ${tCommon('baseInfo.color')}`}
      </DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ py: 3 }}>
          <Field.Text name="colorName" label={formFields['ColorName']} />

          <Stack sx={{ alignItems: 'end', mt: 3 }}>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              {!currentItem
                ? `${tCommon('create')} ${tCommon('baseInfo.color')}`
                : tCommon('save')}
            </Button>
          </Stack>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
