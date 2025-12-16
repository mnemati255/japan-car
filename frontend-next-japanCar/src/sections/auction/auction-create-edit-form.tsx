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
import { IAuctionItem } from '@/types/auction';
import InputAdornment from '@mui/material/InputAdornment';
import { createAuction, updateAuction } from '@/actions/auction';
import {
  LangCode,
  LocalizationProvider,
  useTranslate,
  useTranslateFromServer,
} from '@/locales';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

type Props = {
  currentAuction?: IAuctionItem;
  lang: LangCode;
};

export function AuctionCreateEditForm({ currentAuction, lang }: Props) {
  const router = useRouter();
  const { t: tCommon } = useTranslate('common');
  const { formFields, systemMessages } = useTranslateFromServer();

  const AuctionCreateSchema = z.object({
    auctionName: z.string().min(1, { error: messages.required() }),
    auctionDate: z.string().min(1, { error: messages.required() }),
    auctionFee: z.number(),
  });

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(AuctionCreateSchema),
    defaultValues: {
      auctionName: currentAuction?.auctionName ?? '',
      auctionDate: currentAuction?.auctionDate ?? '',
      auctionFee: currentAuction?.auctionFee ?? 0,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentAuction) {
      reset({
        auctionName: currentAuction.auctionName ?? '',
        auctionDate: currentAuction.auctionDate ?? '',
        auctionFee: currentAuction.auctionFee ?? 0,
      });
    }
  }, [currentAuction, reset, lang]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const api = !currentAuction
        ? createAuction(data)
        : updateAuction(lang, currentAuction.auctionId!, data);

      const { status } = await api;
      if (status == 200) {
        toast.success(
          currentAuction
            ? systemMessages['update_success']
            : systemMessages['create_success']
        );
        router.push(paths.dashboard.auction.root);
      }
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
              <Field.Text name="auctionName" label={formFields['AuctionName']} />
              <LocalizationProvider>
                <Field.DatePicker name="auctionDate" label={formFields['AuctionDate']} />
              </LocalizationProvider>
              <Field.Text
                name="auctionFee"
                label={formFields['AuctionFee']}
                type="number"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
                          ¥
                        </Box>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {!currentAuction
                  ? `${tCommon('create')} ${tCommon('auction.auction')}`
                  : tCommon('save')}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
