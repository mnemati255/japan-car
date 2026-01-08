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

export function ActionTab({ methods }: Props) {
  const { translations } = useTranslateFromServer();

  const { control, setValue, getValues } = methods;

  const sentToAuction = useWatch({ control, name: 'sentToAuction' });

  useEffect(() => {
    if (sentToAuction) {
      const date = new Date(getValues('purchaseDate'));
      date.setDate(date.getDate() + 20);
      setValue('actionDeadlineDate', date.toLocaleDateString());
    } else {
      setValue('actionDeadlineDate', '');
    }
  }, [sentToAuction, setValue, getValues]);

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
          {translations['SentToAction']}
        </Typography>
        <Field.Switch name="sentToAuction" label="" />
      </Stack>
      <span></span>

      <LocalizationProvider>
        <Field.DatePicker
          name="actionDeadlineDate"
          label={translations['ActionDeadlineDate']}
        />
      </LocalizationProvider>

      {sentToAuction && (
        <>
          <LocalizationProvider>
            <Field.DatePicker
              name="auctionSentDate"
              label={translations['ActionSentDate']}
            />
          </LocalizationProvider>
          <Field.Text
            name="auctionSentToPerson"
            label={translations['ActionSentToPerson']}
          />
        </>
      )}
    </Box>
  );
}
