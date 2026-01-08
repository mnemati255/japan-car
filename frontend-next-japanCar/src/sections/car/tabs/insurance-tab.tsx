'use client';

import { Field } from '@/components/hook-form';
import { LocalizationProvider, useTranslateFromServer } from '@/locales';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<any>;
};

export function InsuranceTab({ methods }: Props) {
  const { translations } = useTranslateFromServer();

  const { control, setValue } = methods;

  const hasInsurance = useWatch({ control, name: 'hasShakend' });
  const isInsuranceCancelled = useWatch({ control, name: 'isInsuranceCancelled' });

  useEffect(() => {
    if (!hasInsurance) {
      // setValue('thirdPartyInsuranceNumber', '');
      setValue('plateRegisteredDate', '');
      setValue('deedNumber', '');
    }
  }, [hasInsurance, setValue]);

  useEffect(() => {
    if (!isInsuranceCancelled) {
      setValue('insuranceCancellationDate', '');
    }
  }, [isInsuranceCancelled, setValue]);

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
          {translations['HasShakend']}
        </Typography>
        <Field.Switch
          name="hasShakend"
          label=""
          checked={methods.getValues('hasShakend')}
        />
      </Stack>
      <span></span>

      {hasInsurance && (
        <>
          <LocalizationProvider>
            <Field.DatePicker
              name="thirdPartyInsuranceExpireDate"
              label={translations['ThirdPartyInsuranceExpireDate']}
            />
          </LocalizationProvider>

          <Field.Text
            name="thirdPartyInsuranceCompany"
            label={translations['ThirdPartyInsuranceCompany']}
          />

          {/* <Field.Text
            name="thirdPartyInsuranceNumber"
            label={translations['ThirdPartyInsuranceNumber']}
          /> */}

          <Stack direction={'row'} alignItems={'center'}>
            <Typography variant="subtitle2" color="gray">
              {translations['IsInsuranceCancelled']}
            </Typography>
            <Field.Switch name="isInsuranceCancelled" label="" />
          </Stack>

          {isInsuranceCancelled && (
            <LocalizationProvider>
              <Field.DatePicker
                name="insuranceCancellationDate"
                label={translations['InsuranceCancellationDate']}
              />
            </LocalizationProvider>
          )}
        </>
      )}
    </Box>
  );
}
