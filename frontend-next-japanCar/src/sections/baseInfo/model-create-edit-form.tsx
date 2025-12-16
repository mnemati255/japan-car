import { createItem, getItems, updateItem } from '@/actions/base-action';
import { Field, Form } from '@/components/hook-form';
import { endpoints } from '@/lib/axios';
import messages from '@/lib/messages';
import { LangCode, useTranslate, useTranslateFromServer } from '@/locales';
import { IBrand, IModel } from '@/types/car';
import { IGrid } from '@/types/common';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const ModelSchema = z.object({
  brandId: z.coerce.number().min(1, { error: messages.required() }),
  modelName: z.string().min(1, { error: messages.required() }),
});

type Props = {
  open: boolean;
  onClose: () => void;
  currentItem: IModel | null;
  locale: LangCode;
};

export function ModelCreateEditForm({ onClose, open, currentItem, locale }: Props) {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const { currentLang, t: tCommon } = useTranslate('common');
  const { formFields } = useTranslateFromServer();

  useEffect(() => {
    const getAllBrands = async () => {
      const { status, data } = await getItems<IGrid<IBrand>>(endpoints.baseInfo.brand);
      if (status == 200) {
        setBrands(data.items);
      }
    };
    getAllBrands();
  }, []);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ModelSchema),
    defaultValues: {
      brandId: '',
      modelName: '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentItem) {
      reset({ modelName: currentItem.modelName, brandId: currentItem.brandId });
    } else {
      setTimeout(() => {
        reset({ modelName: '', brandId: '' });
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const api = !currentItem
        ? createItem<IModel>(endpoints.baseInfo.model, data)
        : updateItem<IModel>(
            endpoints.baseInfo.model,
            currentItem.modelId!,
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
            ? `${tCommon('update')} ${tCommon('baseInfo.model')}`
            : tCommon('translation')
          : `${tCommon('create')} ${tCommon('baseInfo.model')}`}
      </DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ py: 3, rowGap: 3, display: 'grid' }}>
          <Field.Select name="brandId" label={formFields['BrandName']}>
            {brands.map((x) => (
              <MenuItem key={x.brandId} value={x.brandId}>
                {x.brandName}
              </MenuItem>
            ))}
          </Field.Select>
          <Field.Text name="modelName" label={formFields['ModelName']} />

          <Stack sx={{ alignItems: 'end', mt: 3 }}>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              {!currentItem
                ? `${tCommon('create')} ${tCommon('baseInfo.model')}`
                : tCommon('save')}
            </Button>
          </Stack>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
