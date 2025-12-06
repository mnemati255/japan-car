import { createBrand, updateBrand } from '@/actions/base-info';
import { Field, Form } from '@/components/hook-form';
import messages from '@/lib/messages';
import { IBrand } from '@/types/car';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const BrandSchema = z.object({
  brandName: z.string().min(1, { error: messages.required() }),
});

type Props = {
  open: boolean;
  onClose: () => void;
  currentItem: IBrand | null;
};

export function BrandCreateEditForm({ onClose, open, currentItem }: Props) {
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      brandName: '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentItem) {
      reset({ brandName: currentItem.brandName });
    } else {
      setTimeout(() => {
        reset({ brandName: '' });
      }, 300);
    }
  }, [currentItem, open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const api = !currentItem
        ? createBrand(data)
        : updateBrand(currentItem.brandId!, data);
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
      <DialogTitle>{currentItem ? 'Update brand' : 'Create brand'}</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ py: 3 }}>
          <Field.Text name="brandName" label="Brand name" />

          <Stack sx={{ alignItems: 'end', mt: 3 }}>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              {!currentItem ? 'Create brand' : 'Save changes'}
            </Button>
          </Stack>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
