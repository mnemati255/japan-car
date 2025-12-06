import { createColor, updateColor } from '@/actions/base-info';
import { Field, Form } from '@/components/hook-form';
import messages from '@/lib/messages';
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

const ColorSchema = z.object({
  colorName: z.string().min(1, { error: messages.required() }),
});

type Props = {
  open: boolean;
  onClose: () => void;
  currentItem: IColor | null;
};

export function ColorCreateEditForm({ onClose, open, currentItem }: Props) {
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
  }, [currentItem, open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const api = !currentItem
        ? createColor(data)
        : updateColor(currentItem.colorId!, data);
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
      <DialogTitle>{currentItem ? 'Update color' : 'Create color'}</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ py: 3 }}>
          <Field.Text name="colorName" label="Color name" />

          <Stack sx={{ alignItems: 'end', mt: 3 }}>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              {!currentItem ? 'Create color' : 'Save changes'}
            </Button>
          </Stack>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
