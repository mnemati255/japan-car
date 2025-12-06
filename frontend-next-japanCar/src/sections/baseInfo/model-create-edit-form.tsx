import { createModel, getBrands, updateModel } from '@/actions/base-info';
import { Field, Form } from '@/components/hook-form';
import messages from '@/lib/messages';
import { IBrand, IModel } from '@/types/car';
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
};

export function ModelCreateEditForm({ onClose, open, currentItem }: Props) {
  const [brands, setBrands] = useState<IBrand[]>([]);

  useEffect(() => {
    const getAllBrands = async () => {
      const { status, data } = await getBrands();
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
  }, [currentItem, open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const api = !currentItem
        ? createModel(data)
        : updateModel(currentItem.modelId!, data);
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
      <DialogTitle>{currentItem ? 'Update model' : 'Create model'}</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ py: 3, rowGap: 3, display: 'grid' }}>
          <Field.Select name="brandId" label="Brand">
            {brands.map((x) => (
              <MenuItem key={x.brandId} value={x.brandId}>
                {x.brandName}
              </MenuItem>
            ))}
          </Field.Select>
          <Field.Text name="modelName" label="Model name" />

          <Stack sx={{ alignItems: 'end', mt: 3 }}>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              {!currentItem ? 'Create model' : 'Save changes'}
            </Button>
          </Stack>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
