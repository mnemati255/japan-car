'use client';

import { Field } from '@/components/hook-form';
import { LocalizationProvider, useTranslateFromServer } from '@/locales';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<any>;
};

export function PoliceTab({ methods }: Props) {
  const { translations } = useTranslateFromServer();

  const { control, setValue } = methods;

  const needsPolice = useWatch({ control, name: 'needsPoliceCertificate' });
  const forSale = useWatch({ control, name: 'forSale' });
  const purchaseDate = useWatch({ control, name: 'purchaseDate' });

  useEffect(() => {
    if (purchaseDate) {
      const date = new Date(purchaseDate);
      date.setDate(date.getDate() + 10);
      setValue('policeCertificateRequestedDate', date.toLocaleDateString());
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
      <Stack direction={'row'} alignItems={'center'}>
        <Typography variant="subtitle2" color="gray">
          {translations['NeedsPoliceCertificate']}
        </Typography>
        <Field.Switch label="" name="needsPoliceCertificate" />
      </Stack>
      <span></span>

      {needsPolice && (
        <>
          <LocalizationProvider>
            <Field.DatePicker
              name="policeCertificateRequestedDate"
              label={translations['PoliceCertificateRequestedDate']}
            />
          </LocalizationProvider>

          <LocalizationProvider>
            <Field.DatePicker
              name="policeDeedCertificateDeliveryDate"
              label={translations['PoliceDeedCertificateDeliveryDate']}
            />
          </LocalizationProvider>

          <Field.Text
            name="policeCertificateNumber"
            label={translations['PoliceCertificateNumber']}
            type="number"
          />

          <LocalizationProvider>
            <Field.DatePicker
              name="policeCertificateReceivedDate"
              label={translations['PoliceCertificateReceivedDate']}
            />
          </LocalizationProvider>

          {forSale == 2 && (
            <Field.Select name="commandType" label={translations['CommandType']}>
              {['F', 'S'].map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Field.Select>
          )}
        </>
      )}
    </Box>
  );
}
