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

export function ShakendTab({ methods }: Props) {
  const { translations } = useTranslateFromServer();

  const { control, setValue } = methods;

  const hasShakend = useWatch({ control, name: 'hasInsurance' });

  useEffect(() => {
    if (hasShakend) {
      setValue('hasShakend', true);
    } else {
      setValue('insuranceEndDate', '');
      setValue('hasShakend', false);
      // setValue('thirdPartyInsuranceNumber', '');
    }
  }, [hasShakend, setValue]);

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
          {translations['HasInsurance']}
        </Typography>
        <Field.Switch
          name="hasInsurance"
          label=""
          checked={methods.getValues('hasInsurance')}
        />
      </Stack>

      {hasShakend && (
        <LocalizationProvider>
          <Field.DatePicker
            name="insuranceEndDate"
            label={translations['InsuranceEndDate']}
          />
        </LocalizationProvider>
      )}
    </Box>
  );
}
