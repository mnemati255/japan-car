'use client';

import { Field } from '@/components/hook-form';
import { PLATETYPES } from '@/constants/car-constants';
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

export function DeedTab({ methods }: Props) {
  const { translations } = useTranslateFromServer();

  const { control, setValue } = methods;

  const plateRegisteredDate = useWatch({ control, name: 'plateRegisteredDate' });
  const engineVolume = useWatch({ control, name: 'engineVolume' });
  const purchaseDate = useWatch({ control, name: 'purchaseDate' });

  // useEffect(() => {
  //   if (plateRegisteredDate) {
  //     const date = new Date(plateRegisteredDate);
  //     date.setDate(date.getDate() + 10);
  //     setValue('policeCertificateRequestedDate', date.toLocaleDateString());
  //   }
  // }, [plateRegisteredDate, setValue]);

  useEffect(() => {
    if (purchaseDate) {
      const date = new Date(purchaseDate);
      date.setDate(date.getDate() + 10);
      setValue('deedRequestedDate', date.toLocaleDateString());
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
        <Field.DatePicker
          name="deedRequestedDate"
          label={translations['DeedRequestedDate']}
        />
      </LocalizationProvider>

      {/* <LocalizationProvider>
        <Field.DatePicker name="deedIssuedDate" label={translations['DeedIssuedDate']} />
      </LocalizationProvider> */}

      <LocalizationProvider>
        <Field.DatePicker
          name="plateRegisteredDate"
          label={translations['PlateRegisteredDate']}
        />
      </LocalizationProvider>

      <Field.Text name="deedNumber" label={translations['DeedNumber']} />

      {plateRegisteredDate && (
        <>
          <Field.Select name="plateType" label={translations['PlateType']}>
            {PLATETYPES.map((x) => (
              <MenuItem key={x.value} value={x.value}>
                {x.title}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Text name="plateNumber" label={translations['PlateNumber']} />
        </>
      )}

      {engineVolume < 1000 && (
        <>
          <LocalizationProvider>
            <Field.DatePicker
              name="newDeedCopySentToBuyerDate"
              label={translations['NewDeedCopySentToBuyerDate']}
            />
          </LocalizationProvider>

          <Stack direction={'row'} alignItems={'center'}>
            <Typography variant="subtitle2" color="gray">
              {translations['IsUnder1000CCDeedCopyUploaded']}
            </Typography>
            <Field.Switch name="isUnder1000CcdeedCopyUploaded" label="" />
          </Stack>
        </>
      )}
    </Box>
  );
}
