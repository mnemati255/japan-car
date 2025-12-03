import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useRouter } from '@/routes/hooks';
import { Form, Field } from '@/components/hook-form';
import messages from '@/lib/messages';
import { ICar, IColor, IModel } from '@/types/car';
import MenuItem from '@mui/material/MenuItem';
import { createEditCarForAuction } from '@/actions/car';
import { toast } from 'sonner';
import { paths } from '@/routes/paths';
import InputAdornment from '@mui/material/InputAdornment';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

type Props = {
  colors: IColor[];
  models: IModel[];
  currentCar?: ICar;
  auctionId: number;
  files?: File[];
};

export function AuctionCreateEditCarForm({
  currentCar,
  colors,
  models,
  auctionId,
  files,
}: Props) {
  const COLORS = colors.map((x) => ({
    value: x.colorId,
    label: x.colorName,
  }));
  const MODELS = models.map((x) => ({
    value: x.modelId,
    label: x.modelName,
  }));

  const router = useRouter();

  const AuctionCarCreateSchema = z.object({
    colorId: z.coerce.number().min(1, { error: messages.required() }),
    modelId: z.coerce.number().min(1, { error: messages.required() }),
    year: z.coerce.number().min(1, { error: messages.required() }),
    mileage: z.coerce.number().min(1, { error: messages.required() }),
    chasisNumber: z.string().min(1, { error: messages.required() }),
    purchasePrice: z.coerce.number().min(1, { error: messages.required() }),
    taxAmount: z.coerce.number().nullable().optional(),
    finalPrice: z.coerce.number().nullable().optional(),
    engineVolume: z.coerce.number().nullable().optional(),
    fuelType: z.string().nullable().optional(),
    technicalTestResult: z.string().nullable().optional(),
    usageStatus: z.string().nullable().optional(),
    images: z.array(z.instanceof(File)).default([]),
  });

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(AuctionCarCreateSchema),
    defaultValues: {
      colorId: currentCar?.colorId ?? '',
      modelId: currentCar?.modelId ?? '',
      year: currentCar?.year ?? '',
      mileage: currentCar?.mileage ?? '',
      chasisNumber: currentCar?.chasisNumber ?? '',
      engineVolume: currentCar?.engineVolume ?? '',
      fuelType: currentCar?.fuelType ?? '',
      technicalTestResult: currentCar?.technicalTestResult ?? '',
      usageStatus: currentCar?.usageStatus ?? '',
      purchasePrice: currentCar?.purchasePrice ?? '',
      taxAmount: currentCar?.taxAmount ?? '',
      finalPrice: currentCar?.finalPrice ?? '',
      images: [],
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (files && files.length > 0) {
      setValue('images', files, { shouldValidate: true });
    }
  }, [files, setValue]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { status } = await createEditCarForAuction(
        data,
        auctionId,
        currentCar ? currentCar.carId! : null
      );
      if (status == 200) {
        toast.success(currentCar ? 'Update success!' : 'Create success!');
        router.push(paths.dashboard.auction.cars(auctionId));
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
              <Field.Select name="colorId" label="Color">
                {COLORS.map((x) => (
                  <MenuItem key={x.value} value={x.value}>
                    {x.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select name="modelId" label="Model">
                {MODELS.map((x) => (
                  <MenuItem key={x.value} value={x.value}>
                    {x.label}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Text name="year" label="Year" type="number" />
              <Field.Text name="mileage" label="Mileage" type="number" />
              <Field.Text name="chasisNumber" label="Chasis number" />
              <Field.Text name="engineVolume" label="Engine volume" type="number" />
              <Field.Text name="fuelType" label="Fuel type" />
              <Field.Text name="technicalTestResult" label="Technical test result" />
              <Field.Text name="usageStatus" label="Usage status" />
              <Field.Text
                name="purchasePrice"
                label="Purchase Price"
                type="number"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
                          $
                        </Box>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Field.Text
                name="taxAmount"
                label="Tax amount"
                type="number"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
                          $
                        </Box>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Field.Text
                name="finalPrice"
                label="Final price"
                type="number"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
                          $
                        </Box>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Grid sx={{ gridColumn: 'span 2' }}>
                <Field.Upload
                  multiple
                  name="images"
                  maxSize={3145728}
                  onRemove={(inputFile) =>
                    setValue(
                      'images',
                      values.images!.filter((file) => file !== inputFile),
                      { shouldValidate: true }
                    )
                  }
                  onRemoveAll={() => setValue('images', [], { shouldValidate: true })}
                />
              </Grid>
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {!currentCar ? 'Create car' : 'Save changes'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
