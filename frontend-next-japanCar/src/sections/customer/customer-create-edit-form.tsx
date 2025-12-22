'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';
import { toast } from '@/components/snackbar';
import { Form, Field } from '@/components/hook-form';
import messages from '@/lib/messages';
import Typography from '@mui/material/Typography';
import { useTranslate, useTranslateFromServer } from '@/locales';
import { ICustomer } from '@/types/customer';
import { createItem, updateItem } from '@/actions/base-action';
import { endpoints } from '@/lib/axios';

// ----------------------------------------------------------------------

type Props = {
  currentCustomer?: ICustomer;
};

const CustomerSchema = z.object({
  firstName: z.string().min(1, { error: messages.required() }),
  lastName: z.string().min(1, { error: messages.required() }),
  email: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(z.email({ error: messages.invalid }).optional()),
  phone: z.coerce.string(),
  address: z.string(),
  isActive: z.boolean(),
});

export function CustomerCreateEditForm({ currentCustomer }: Props) {
  const router = useRouter();
  const { t: tCommon } = useTranslate('common');
  const { translations } = useTranslateFromServer();

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      firstName: currentCustomer?.firstName ?? '',
      lastName: currentCustomer?.firstName ?? '',
      email: currentCustomer?.email ?? '',
      isActive: currentCustomer?.isActive ?? true,
      address: currentCustomer?.address ?? '',
      phone: currentCustomer?.phone ?? '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const api = !currentCustomer
        ? createItem<ICustomer>(endpoints.customer, data)
        : updateItem<ICustomer>(endpoints.customer, currentCustomer.customerId!, data);

      const { status } = await api;
      if (status == 200) {
        toast.success(
          currentCustomer
            ? translations['update_success']
            : translations['create_success']
        );
      }
      router.push(paths.dashboard.customer.root);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="firstName" label={translations['FirstName']} />
              <Field.Text name="lastName" label={translations['LastName']} />
              <Field.Text name="email" label={translations['Email']} />
              <Field.Text name="phone" label={translations['Phone']} type="number" />
              <Field.Text
                name="address"
                label={translations['Address']}
                multiline={true}
                sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
              />

              <Stack sx={{ gridColumnStart: 1 }} direction={'row'} alignItems={'center'}>
                <Typography variant="subtitle2" color="gray">
                  {tCommon('customer.isCustomerActive')}
                </Typography>
                <Field.Switch name="isActive" label="" />
              </Stack>
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {!currentCustomer
                  ? `${tCommon('create')} ${tCommon('customer.customer')}`
                  : tCommon('save')}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
