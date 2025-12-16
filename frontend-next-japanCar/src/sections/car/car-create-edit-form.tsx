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
import { createEditCar } from '@/actions/car';
import { toast } from 'sonner';
import { paths } from '@/routes/paths';
import InputAdornment from '@mui/material/InputAdornment';
import { useCallback, useEffect, useState } from 'react';
import { getModelsOfBrand } from '@/actions/base-info';
import { LocalizationProvider, useTranslate, useTranslateFromServer } from '@/locales';
import { PLATES } from '@/constants/plate-types';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = {
  colors: IColor[];
  brands: IBrand[];
  currentCar?: ICar;
  files?: File[];
  auctionId?: number;
};

export function CreateEditCarForm({
  currentCar,
  colors,
  brands,
  files,
  auctionId,
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
  const { formFields, systemMessages } = useTranslateFromServer();
  const { t: tCommon } = useTranslate('common');
  const [models, setModels] = useState<IModel[]>([]);

  const AuctionCarCreateSchema = z
    .object({
      brandId: z.coerce.number().min(1, { error: messages.required() }),
      modelId: z.coerce.number().min(1, { error: messages.required() }),
      colorId: z.coerce.number().min(1, { error: messages.required() }),
      year: z.coerce
        .number()
        .min(1900, { error: messages.invalid() })
        .max(9999, { error: messages.invalid() }),
      mileage: z.preprocess((val) => {
        if (val === '' || val === null || val === undefined) return undefined;
        return Number(val);
      }, z.number({ error: messages.required() })),
      chasisNumber: z.string().min(1, { error: messages.required() }),
      purchasePrice: z.coerce.number().min(1, { error: messages.required() }),
      transportPrice: z.coerce.number().nullable().optional(),
      auctionPrice: z.coerce.number().nullable().optional(),
      taxAmount: z.coerce.number().nullable().optional(),
      finalPrice: z.coerce.number().nullable().optional(),
      engineVolume: z.coerce.number().nullable().optional(),
      fuelType: z.string().nullable().optional(),
      images: z
        .array(z.instanceof(File))
        .min(3, { error: messages.minCount(3) })
        .default([]),
      scrapCost: z.coerce.number().nullable().optional(),
      manufactureMonth: z.coerce
        .number()
        .min(1, { error: messages.invalid() })
        .max(12, { error: messages.invalid() }),
      transmissionType: z.string().nullable().optional(),
      plateType: z.coerce.number().min(1, { error: messages.required() }),
      plateNumber: z.string(),
      purchaseDate: z.string(),
      hasInsurance: z.boolean({ error: messages.required() }),
      insuranceStartDate: z.string().optional(),
      insuranceEndDate: z.string().optional(),
      insurancePolicyNumber: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.hasInsurance) {
        if (!data.insuranceStartDate) {
          ctx.addIssue({
            path: ['insuranceStartDate'],
            code: 'custom',
            message: messages.required(),
          });
        }
        if (!data.insuranceEndDate) {
          ctx.addIssue({
            path: ['insuranceEndDate'],
            code: 'custom',
            message: messages.required(),
          });
        }
        if (!data.insurancePolicyNumber) {
          ctx.addIssue({
            path: ['insurancePolicyNumber'],
            code: 'custom',
            message: messages.required(),
          });
        }
      }
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
      manufactureMonth: currentCar?.manufactureMonth ?? '',
      transmissionType: currentCar?.transmissionType ?? '',
      plateType: currentCar?.plateType ?? '',
      plateNumber: currentCar?.plateNumber ?? '',
      purchaseDate: currentCar?.purchaseDate ?? '',
      hasInsurance: currentCar?.hasInsurance ?? false,
      insuranceStartDate: currentCar?.insuranceStartDate ?? '',
      insuranceEndDate: currentCar?.insuranceEndDate ?? '',
      insurancePolicyNumber: currentCar?.insurancePolicyNumber ?? '',
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

  const hasInsurance = useWatch({ control, name: 'hasInsurance' });
  const purchasePrice = useWatch({ control, name: 'purchasePrice' });
  const transportPrice = useWatch({ control, name: 'transportPrice' });
  const scrapCost = useWatch({ control, name: 'scrapCost' });
  const auctionPrice = useWatch({ control, name: 'auctionPrice' });

  useEffect(() => {
    const p1 = Number(purchasePrice) || 0;
    const p2 = Number(transportPrice) || 0;
    const p3 = Number(auctionPrice) || 0;
    const p4 = Number(scrapCost) || 0;

    const total = p1 + p2 + p3 + p4;
    const tax = total * 0.1;

    setValue('taxAmount', tax);
    setValue('finalPrice', total + tax);
  }, [purchasePrice, transportPrice, auctionPrice, setValue, scrapCost]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { status } = await createEditCar(
        data,
        auctionId ?? null,
        currentCar ? currentCar.carId! : null
      );
      if (status == 200) {
        toast.success(
          currentCar ? systemMessages['update_success'] : systemMessages['create_success']
        );
        if (!auctionId) router.push(paths.dashboard.car.root);
        else router.push(paths.dashboard.auction.cars(auctionId));
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
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                },
              }}
            >
              <Field.Select
                name="brandId"
                label={formFields['BrandName']}
                onChange={(e) => {
                  const id = +e.target.value;
                  setValue('brandId', id, { shouldValidate: true });
                  onSelectBrand(id);
                }}
              >
                {BRANDS.map((x) => (
                  <MenuItem key={`brand_${x.value}`} value={x.value}>
                    {x.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select name="modelId" label={formFields['ModelName']}>
                {models.map((x) => (
                  <MenuItem key={`model_${x.modelId}`} value={x.modelId}>
                    {x.modelName}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select name="colorId" label={formFields['ColorId']}>
                {COLORS.map((x) => (
                  <MenuItem key={`color_${x.value}`} value={x.value}>
                    {x.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Field.Text name="year" label={formFields['Year']} type="number" />
                <Field.Text
                  name="manufactureMonth"
                  label={formFields['ManufactureMonth']}
                  type="number"
                />
              </Box>

              <LocalizationProvider>
                <Field.DatePicker
                  name="purchaseDate"
                  label={formFields['PurchaseDate']}
                />
              </LocalizationProvider>

              <Field.Text name="mileage" label={formFields['Mileage']} type="number" />

              <Field.Text name="chasisNumber" label={formFields['ChassisNumber']} />

              <Field.Text
                name="engineVolume"
                label={formFields['EngineVolume']}
                type="number"
              />

              <Field.Select name="fuelType" label={formFields['FuelType']}>
                {['CNG', 'G', 'D'].map((x) => (
                  <MenuItem key={x} value={x}>
                    {x}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select
                name="transmissionType"
                label={formFields['TransmissionType']}
              >
                {['A', 'M', 'CVT'].map((x) => (
                  <MenuItem key={x} value={x}>
                    {x}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select name="plateType" label={formFields['PlateType']}>
                {PLATES.map((x) => (
                  <MenuItem key={x.value} value={x.value}>
                    {x.title}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text name="plateNumber" label={formFields['PlateNumber']} />

              <Field.Text
                name="purchasePrice"
                label={formFields['PurchasePrice']}
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

              <Field.Text
                name="transportPrice"
                label={formFields['TransportPrice']}
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

              <Field.Text
                name="scrapCost"
                label={formFields['ScrapCost']}
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

              <Field.Text
                name="auctionPrice"
                label={formFields['AuctionPrice']}
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

              <Field.Text
                name="taxAmount"
                label={formFields['TaxAmount']}
                type="number"
                disabled
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

              <Field.Text
                name="finalPrice"
                label={formFields['FinalPrice']}
                type="number"
                disabled
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

              <Stack direction={'row'} alignItems={'center'}>
                <Typography variant="subtitle2" color="gray">
                  {tCommon('car.hasInsurance')}
                </Typography>
                <Field.Switch name="hasInsurance" label="" />
              </Stack>

              {hasInsurance && (
                <>
                  <Field.Text
                    name="insurancePolicyNumber"
                    label={formFields['InsurancePolicyNumber']}
                  />

                  <LocalizationProvider>
                    <Field.DatePicker
                      name="insuranceStartDate"
                      label={formFields['InsuranceStartDate']}
                    />
                  </LocalizationProvider>

                  <LocalizationProvider>
                    <Field.DatePicker
                      name="insuranceEndDate"
                      label={formFields['InsuranceEndDate']}
                    />
                  </LocalizationProvider>
                </>
              )}

              <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
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
              </Box>
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {!currentCar
                  ? `${tCommon('create')} ${tCommon('car.car')}`
                  : tCommon('save')}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
