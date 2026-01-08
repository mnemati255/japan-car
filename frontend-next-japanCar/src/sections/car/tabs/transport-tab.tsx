'use client';

import { Field } from '@/components/hook-form';
import { TRANSPORTFROM, TRANSPORTTO } from '@/constants/car-constants';
import { LocalizationProvider, useTranslateFromServer } from '@/locales';
import { IUser } from '@/types/user';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<any>;
  users: IUser[];
};

export function TransportTab({ methods, users }: Props) {
  const USERS = users.map((x) => ({
    value: x.userId,
    label: x.userName,
  }));

  const { translations } = useTranslateFromServer();

  const { control, setValue } = methods;

  const purchaseDate = useWatch({ control, name: 'purchaseDate' });
  
  useEffect(() => {
    if (purchaseDate) {
      const date = new Date(purchaseDate);
      date.setDate(date.getDate() + 2);
      setValue('transportDate', date.toLocaleDateString());
    }
  }, [purchaseDate, setValue]);

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
      <LocalizationProvider>
        <Field.DatePicker name="transportDate" label={translations['TransportDate']} />
      </LocalizationProvider>

      <LocalizationProvider>
        <Field.DatePicker
          name="transportCompanyRequestDate"
          label={translations['TransportCompanyRequestDate']}
        />
      </LocalizationProvider>

      <Field.Select name="transportFrom" label={translations['TransportFrom']}>
        {TRANSPORTFROM.map((x) => (
          <MenuItem key={x.value} value={x.value}>
            {x.title}
          </MenuItem>
        ))}
      </Field.Select>
      
      <Field.Select name="transportTo" label={translations['TransportTo']}>
        {TRANSPORTTO.map((x) => (
          <MenuItem key={x.value} value={x.value}>
            {x.title}
          </MenuItem>
        ))}
      </Field.Select>

      <LocalizationProvider>
        <Field.DatePicker
          name="transportDateReceived"
          label={translations['TransportDateReceived']}
        />
      </LocalizationProvider>
      <Stack direction={'row'} alignItems={'center'}>
        <Typography variant="subtitle2" color="gray">
          {translations['TransportConfirm']}
        </Typography>
        <Field.Switch name="transportConfirm" label="" />
      </Stack>
      <Field.Select
        name="transportConfirmUserId"
        label={translations['TransportConfirmUserId']}
      >
        {USERS.map((x) => (
          <MenuItem key={`user_${x.value}`} value={x.value}>
            {x.label}
          </MenuItem>
        ))}
      </Field.Select>
    </Box>
  );
}
