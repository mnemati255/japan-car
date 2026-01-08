'use client';

import { Field } from '@/components/hook-form';
import { LocalizationProvider, useTranslateFromServer } from '@/locales';
import { ICustomer } from '@/types/customer';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<any>;
  customers: ICustomer[];
};

export function SaleTab({ methods, customers }: Props) {
  const CUSTOMERS = customers.map((x) => ({
    value: x.customerId,
    label: `${x.firstName} ${x.lastName}`,
  }));

  const { translations } = useTranslateFromServer();

  const { setValue } = methods;

  return (
    <Box
      sx={{
        rowGap: 3,
        columnGap: 2,
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        },
      }}
    >
      <Field.Autocomplete
        name="buyerId"
        label={translations['BuyerId']}
        options={CUSTOMERS}
        getOptionKey={(option) => option.value}
        getOptionLabel={(option) => option?.label ?? ''}
        isOptionEqualToValue={(option, value) =>
          option?.value === value?.value || option?.value === value
        }
        value={CUSTOMERS.find((b) => b.value === methods.watch('buyerId')) ?? null}
        onChange={(_, selected) => {
          setValue('buyerId', selected.value, { shouldValidate: true });
        }}
      />

      <LocalizationProvider>
        <Field.DatePicker name="saleDate" label={translations['SaleDate']} />
      </LocalizationProvider>

      <Field.Text
        name="salePrice"
        label={translations['SalePrice']}
        type="number"
        thousandSeparator={true}
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
    </Box>
  );
}
