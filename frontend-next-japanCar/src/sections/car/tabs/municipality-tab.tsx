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

export function MunicipalityTab({ methods }: Props) {
  const { translations } = useTranslateFromServer();

  const { control, setValue, getValues } = methods;

  const sentToMunicipality = useWatch({ control, name: 'sentToMunicipality' });

  useEffect(() => {
    if (sentToMunicipality) {
      const date = new Date(getValues('purchaseDate'));
      date.setDate(date.getDate() + 20);
      setValue('municipalityDeadlineDate', date.toLocaleDateString());
    } else {
      setValue('municipalityDeadlineDate', '');
    }
  }, [sentToMunicipality, setValue, getValues]);

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
          {translations['SentToMunicipality']}
        </Typography>
        <Field.Switch name="sentToMunicipality" label="" />
      </Stack>
      <span></span>

      <LocalizationProvider>
        <Field.DatePicker
          name="municipalityDeadlineDate"
          label={translations['MunicipalityDeadlineDate']}
        />
      </LocalizationProvider>

      {sentToMunicipality && (
        <>
          <LocalizationProvider>
            <Field.DatePicker
              name="municipalitySentDate"
              label={translations['MunicipalitySentDate']}
            />
          </LocalizationProvider>
          <Field.Text
            name="municipalitySentToPerson"
            label={translations['MunicipalitySentToPerson']}
          />
        </>
      )}
    </Box>
  );
}
