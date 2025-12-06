import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useRouter } from '@/routes/hooks';
import { Form, Field } from '@/components/hook-form';
import messages from '@/lib/messages';
import { IBrand, ICar, IColor, IModel } from '@/types/car';
import MenuItem from '@mui/material/MenuItem';
import { createEditCarForAuction } from '@/actions/car';
import { toast } from 'sonner';
import { paths } from '@/routes/paths';
import InputAdornment from '@mui/material/InputAdornment';
import { useCallback, useEffect, useState } from 'react';
import { getModelsOfBrand } from '@/actions/base-info';

// ----------------------------------------------------------------------

type Props = {
  colors: IColor[];
  brands: IBrand[];
  currentCar?: ICar;
  auctionId: number;
  files?: File[];
};

export function AuctionCreateEditCarForm({
  currentCar,
  colors,
  brands,
  auctionId,
  files,
}: Props) {
  const BRANDS = brands.map((x) => ({
    value: x.brandId,
    label: x.brandName,
  }));

  const COLORS = colors.map((x) => ({
    value: x.colorId,
    label: x.colorName,
  }));

  const router = useRouter();

  const [models, setModels] = useState<IModel[]>([]);

  const AuctionCarCreateSchema = z.object({
    brandId: z.coerce.number().min(1, { error: messages.required() }),
    modelId: z.coerce.number().min(1, { error: messages.required() }),
    colorId: z.coerce.number().min(1, { error: messages.required() }),
    year: z.coerce.number().min(1, { error: messages.required() }),
    mileage: z.coerce.number().min(1, { error: messages.required() }),
    chasisNumber: z.string().min(1, { error: messages.required() }),
    purchasePrice: z.coerce.number().min(1, { error: messages.required() }),
    taxAmount: z.coerce.number().nullable().optional(),
    finalPrice: z.coerce.number().nullable().optional(),
    transportPrice: z.coerce.number().nullable().optional(),
    auctionPrice: z.coerce.number().nullable().optional(),
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
      brandId: currentCar?.brandId ?? '',
      colorId: currentCar?.colorId ?? '',
      modelId: currentCar?.modelId ?? '',
      year: currentCar?.year ?? '',
      mileage: currentCar?.mileage ?? '',
      chasisNumber: currentCar?.chasisNumber ?? '',
      engineVolume: currentCar?.engineVolume ?? '',
      fuelType: currentCar?.fuelType ?? '',
      purchasePrice: currentCar?.purchasePrice ?? 0,
      taxAmount: currentCar?.taxAmount ?? 0,
      transportPrice: currentCar?.transportPrice ?? 0,
      auctionPrice: currentCar?.auctionPrice ?? 0,
      finalPrice: currentCar?.finalPrice ?? 0,
      images: [],
    },
  });

  const {
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSelectBrand = useCallback(
    async (brandId: number) => {
      setValue('modelId', '');
      const { status, data } = await getModelsOfBrand(brandId);
      if (status == 200) {
        setModels(data);
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (currentCar) {
      const getModelsInEdit = async () => {
        await onSelectBrand(currentCar.brandId!);
      };
      getModelsInEdit();
      setValue('modelId', currentCar.modelId);
    }
  }, [currentCar, onSelectBrand, setValue]);

  useEffect(() => {
    if (files && files.length > 0) {
      setValue('images', files, { shouldValidate: true });
    }
  }, [files, setValue]);

  const purchasePrice = useWatch({ control, name: 'purchasePrice' });
  const transportPrice = useWatch({ control, name: 'transportPrice' });
  const auctionPrice = useWatch({ control, name: 'auctionPrice' });

  useEffect(() => {
    const p1 = Number(purchasePrice) || 0;
    const p2 = Number(transportPrice) || 0;
    const p3 = Number(auctionPrice) || 0;

    const total = p1 + p2 + p3;
    const tax = total * 0.1;

    setValue('taxAmount', tax);
    setValue('finalPrice', total + tax);
  }, [purchasePrice, transportPrice, auctionPrice, setValue]);

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
              <Field.Select
                name="brandId"
                label="Brand"
                onChange={(e) => {
                  const id = +e.target.value;
                  setValue('brandId', id, { shouldValidate: true });
                  onSelectBrand(id);
                }}
              >
                {BRANDS.map((x) => (
                  <MenuItem key={x.value} value={x.value}>
                    {x.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select name="modelId" label="Model">
                {models.map((x) => (
                  <MenuItem key={x.modelId} value={x.modelId}>
                    {x.modelName}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select name="colorId" label="Color">
                {COLORS.map((x) => (
                  <MenuItem key={x.value} value={x.value}>
                    {x.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text name="year" label="Year" type="number" />
              <Field.Text name="mileage" label="KM" type="number" />
              <Field.Text name="chasisNumber" label="Chasis number" />
              <Field.Text name="engineVolume" label="Engine volume" type="number" />
              <Field.Select name="fuelType" label="Fuel type">
                {['CNG', 'G', 'D'].map((x) => (
                  <MenuItem key={x} value={x}>
                    {x}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text
                name="purchasePrice"
                label="Purchase price"
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
                name="transportPrice"
                label="transport price"
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
                name="auctionPrice"
                label="Auction Price"
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
                disabled
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
                disabled
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
                      methods.getValues('images')!.filter((file) => file !== inputFile),
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
