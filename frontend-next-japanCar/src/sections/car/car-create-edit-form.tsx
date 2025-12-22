import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Form, Field } from '@/components/hook-form';
import messages from '@/lib/messages';
import { IBrand, ICar, IColor, IModel } from '@/types/car';
import MenuItem from '@mui/material/MenuItem';
import { createEditCar } from '@/actions/car';
import InputAdornment from '@mui/material/InputAdornment';
import { useCallback, useEffect, useState } from 'react';
import { getModelsOfBrand } from '@/actions/base-info';
import { LocalizationProvider, useTranslate, useTranslateFromServer } from '@/locales';
import {
  FORSALEITEMS,
  PLATETYPES,
  TRANSPORTFROM,
  TRANSPORTTO,
} from '@/constants/car-constants';
import Typography from '@mui/material/Typography';
import { FieldGroup } from '@/components/field-group';
import { CarPrintDialog } from './car-print-dialog';
import { useBoolean } from 'minimal-shared/hooks';

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

  const { translations } = useTranslateFromServer();
  const { t: tCommon } = useTranslate('common');
  const [models, setModels] = useState<IModel[]>([]);
  const dialog = useBoolean();

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
      plateType: z.coerce.number(),
      plateNumber: z.string(),
      purchaseDate: z.string().min(1, { error: messages.required() }),
      hasInsurance: z.boolean({ error: messages.required() }),
      insuranceEndDate: z.string().optional(),
      forSale: z.coerce.number(),
      transportFrom: z.coerce.number(),
      transportTo: z.coerce.number(),
      transportConfirm: z.boolean(),
      transportDate: z.string(),
      transportDateReceived: z.string(),
      needsPoliceCertificate: z.boolean(),
      policeCertificateRequestedDate: z.string(),
      policeCertificateReceivedDate: z.string(),
      deedRequestedDate: z.string(),
      deedIssuedDate: z.string(),
      plateRegisteredDate: z.string(),
      sukuraNumber: z.number().optional(),
      sentToMunicipality: z.boolean(),
      municipalitySentDate: z.string().optional(),
      municipalitySentToPerson: z.string().optional(),
      sentToAuction: z.boolean(),
      auctionSentDate: z.string().optional(),
      auctionSentToPerson: z.string().optional(),
      plateRevoked: z.boolean(),
      plateRevokedDate: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.hasInsurance && !data.insuranceEndDate) {
        ctx.addIssue({
          path: ['insuranceEndDate'],
          code: 'custom',
          message: messages.required(),
        });
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
      insuranceEndDate: currentCar?.insuranceEndDate ?? '',
      forSale: currentCar?.forSale ?? '',
      transportFrom: currentCar?.transportFrom ?? '',
      transportTo: currentCar?.transportTo ?? '',
      transportConfirm: currentCar?.transportConfirm ?? false,
      transportDate: currentCar?.transportDate ?? '',
      transportDateReceived: currentCar?.transportDateReceived ?? '',
      needsPoliceCertificate: currentCar?.needsPoliceCertificate ?? false,
      policeCertificateRequestedDate: currentCar?.policeCertificateRequestedDate ?? '',
      policeCertificateReceivedDate: currentCar?.policeCertificateReceivedDate ?? '',
      deedRequestedDate: currentCar?.deedRequestedDate ?? '',
      deedIssuedDate: currentCar?.deedIssuedDate ?? '',
      plateRegisteredDate: currentCar?.plateRegisteredDate ?? '',
      sentToMunicipality: currentCar?.sentToMunicipality ?? false,
      municipalitySentDate: currentCar?.municipalitySentDate ?? '',
      municipalitySentToPerson: currentCar?.municipalitySentToPerson ?? '',
      sentToAuction: currentCar?.sentToAuction ?? false,
      auctionSentDate: currentCar?.auctionSentDate ?? '',
      auctionSentToPerson: currentCar?.auctionSentToPerson ?? '',
      plateRevoked: currentCar?.plateRevoked ?? false,
      plateRevokedDate: currentCar?.plateRevokedDate ?? '',
      sukuraNumber: currentCar?.sukuraNumber ?? 0,
    },
  });

  const {
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting, errors },
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

  const purchaseDate = useWatch({ control, name: 'purchaseDate' });
  const hasInsurance = useWatch({ control, name: 'hasInsurance' });
  const purchasePrice = useWatch({ control, name: 'purchasePrice' });
  const transportPrice = useWatch({ control, name: 'transportPrice' });
  const scrapCost = useWatch({ control, name: 'scrapCost' });
  const auctionPrice = useWatch({ control, name: 'auctionPrice' });
  const forSale = useWatch({ control, name: 'forSale' });
  const needsPolice = useWatch({ control, name: 'needsPoliceCertificate' });
  const plateRegisteredDate = useWatch({ control, name: 'plateRegisteredDate' });
  const sentToMunicipality = useWatch({ control, name: 'sentToMunicipality' });
  const sentToAuction = useWatch({ control, name: 'sentToAuction' });
  const plateRevoked = useWatch({ control, name: 'plateRevoked' });

  useEffect(() => {
    if (purchaseDate && needsPolice) {
      const date = new Date(purchaseDate);
      date.setMonth(date.getMonth() + 1);
      setValue('policeCertificateRequestedDate', date.toLocaleDateString());
      setValue('deedRequestedDate', date.toLocaleDateString());
      setValue('plateRegisteredDate', date.toLocaleDateString());
    }
  }, [needsPolice, purchaseDate, setValue]);

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
      const { status, data: sukuraNumber } = await createEditCar(
        data,
        auctionId ?? null,
        currentCar ? currentCar.carId! : null
      );
      if (status == 200) {
        setValue('sukuraNumber', sukuraNumber);
        dialog.onTrue();
      }
    } catch (error) {
      console.error(error);
    }
  });

  const renderPrintDialog = () => (
    <CarPrintDialog
      open={dialog.value}
      car={methods.getValues() as ICar}
      auctionId={auctionId}
      isUpdated={currentCar != null}
      model={
        models.find((x) => x.modelId === methods.getValues('modelId'))?.modelName ?? ''
      }
      
    />
  );

  return (
    <>
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
                <FieldGroup
                  title={translations['General']}
                  sx={{ gridColumn: { sx: 'span 1', sm: 'span 2' } }}
                />

                <Box sx={{ mb: 3, gridColumn: { sx: 'span 1', sm: 'span 2' } }}>
                  <Typography variant="subtitle2" color="gray">
                    {translations['SukuraNumber']} :{' '}
                    {methods.getValues('sukuraNumber') ?? '-----'}
                  </Typography>
                </Box>

                <Field.Select
                  name="brandId"
                  label={translations['BrandName']}
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

                <Field.Select name="modelId" label={translations['ModelName']}>
                  {models.map((x) => (
                    <MenuItem key={`model_${x.modelId}`} value={x.modelId}>
                      {x.modelName}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Select name="colorId" label={translations['ColorId']}>
                  {COLORS.map((x) => (
                    <MenuItem key={`color_${x.value}`} value={x.value}>
                      {x.label}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Field.Text name="year" label={translations['Year']} type="number" />
                  <Field.Text
                    name="manufactureMonth"
                    label={translations['ManufactureMonth']}
                    type="number"
                  />
                </Box>

                <LocalizationProvider>
                  <Field.DatePicker
                    name="purchaseDate"
                    label={translations['PurchaseDate']}
                  />
                </LocalizationProvider>

                <Field.Text
                  name="mileage"
                  label={translations['Mileage']}
                  type="number"
                />

                <Field.Text name="chasisNumber" label={translations['ChassisNumber']} />

                <Field.Text
                  name="engineVolume"
                  label={translations['EngineVolume']}
                  type="number"
                />

                <Field.Select name="fuelType" label={translations['FuelType']}>
                  {['CNG', 'G', 'D'].map((x) => (
                    <MenuItem key={x} value={x}>
                      {x}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Select
                  name="transmissionType"
                  label={translations['TransmissionType']}
                >
                  {['A', 'M', 'CVT'].map((x) => (
                    <MenuItem key={x} value={x}>
                      {x}
                    </MenuItem>
                  ))}
                </Field.Select>

                <FieldGroup
                  title={translations['Prices']}
                  sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
                />
                <Field.Text
                  name="purchasePrice"
                  label={translations['PurchasePrice']}
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
                  label={translations['ScrapCost']}
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
                  label={translations['AuctionPrice']}
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
                  label={translations['TaxAmount']}
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
                  label={translations['FinalPrice']}
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

                <FieldGroup
                  title={translations['Insurance']}
                  sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
                />
                <Stack direction={'row'} alignItems={'center'}>
                  <Typography variant="subtitle2" color="gray">
                    {tCommon('car.hasInsurance')}
                  </Typography>
                  <Field.Switch name="hasInsurance" label="" />
                </Stack>

                {hasInsurance && (
                  <>
                    <LocalizationProvider>
                      <Field.DatePicker
                        name="insuranceEndDate"
                        label={translations['InsuranceEndDate']}
                      />
                    </LocalizationProvider>
                  </>
                )}

                <FieldGroup
                  title={translations['Transport']}
                  sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
                />
                <Field.Text
                  name="transportPrice"
                  label={translations['TransportPrice']}
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
                <Field.Select name="transportFrom" label={translations['TransportFrom']}>
                  {TRANSPORTFROM.map((x) => (
                    <MenuItem key={x.value} value={x.value}>
                      {x.title}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Select name="transportTo" label={translations['TransportTo']}>
                  {TRANSPORTTO.map((x) => (
                    <MenuItem key={x.value} value={x.value}>
                      {x.title}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Stack direction={'row'} alignItems={'center'}>
                  <Typography variant="subtitle2" color="gray">
                    {translations['TransportConfirm']}
                  </Typography>
                  <Field.Switch name="transportConfirm" label="" />
                </Stack>

                <LocalizationProvider>
                  <Field.DatePicker
                    name="transportDate"
                    label={translations['TransportDate']}
                  />
                </LocalizationProvider>

                <LocalizationProvider>
                  <Field.DatePicker
                    name="transportDateReceived"
                    label={translations['TransportDateReceived']}
                  />
                </LocalizationProvider>

                <FieldGroup
                  title={translations['PoliceCertificate']}
                  sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
                />
                <Field.Select name="forSale" label={translations['ForSale']}>
                  {FORSALEITEMS.map((x) => (
                    <MenuItem key={x.value} value={x.value}>
                      {x.title}
                    </MenuItem>
                  ))}
                </Field.Select>

                {forSale == 1 && (
                  <>
                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography variant="subtitle2" color="gray">
                        {translations['NeedsPoliceCertificate']}
                      </Typography>
                      <Field.Switch name="needsPoliceCertificate" label="" />
                    </Stack>

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
                            name="policeCertificateReceivedDate"
                            label={translations['PoliceCertificateReceivedDate']}
                          />
                        </LocalizationProvider>
                      </>
                    )}

                    {plateRegisteredDate && (
                      <>
                        <Field.Select name="plateType" label={translations['PlateType']}>
                          {PLATETYPES.map((x) => (
                            <MenuItem key={x.value} value={x.value}>
                              {x.title}
                            </MenuItem>
                          ))}
                        </Field.Select>

                        <Field.Text
                          name="plateNumber"
                          label={translations['PlateNumber']}
                        />
                      </>
                    )}
                  </>
                )}

                <FieldGroup
                  title={translations['Deed']}
                  sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
                />
                <LocalizationProvider>
                  <Field.DatePicker
                    name="deedRequestedDate"
                    label={translations['DeedRequestedDate']}
                  />
                </LocalizationProvider>

                <LocalizationProvider>
                  <Field.DatePicker
                    name="deedIssuedDate"
                    label={translations['DeedIssuedDate']}
                  />
                </LocalizationProvider>

                <LocalizationProvider>
                  <Field.DatePicker
                    name="plateRegisteredDate"
                    label={translations['PlateRegisteredDate']}
                  />
                </LocalizationProvider>

                <FieldGroup
                  title={translations['SentToMunicipality']}
                  sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
                />
                <Stack direction={'row'} alignItems={'center'}>
                  <Typography variant="subtitle2" color="gray">
                    {translations['SentToMunicipality']}
                  </Typography>
                  <Field.Switch name="sentToMunicipality" label="" />
                </Stack>
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

                <FieldGroup
                  title={translations['SentToAction']}
                  sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
                />
                <Stack direction={'row'} alignItems={'center'}>
                  <Typography variant="subtitle2" color="gray">
                    {translations['SentToAction']}
                  </Typography>
                  <Field.Switch name="sentToAuction" label="" />
                </Stack>
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

                <FieldGroup
                  title={translations['PlateRevoking']}
                  sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
                />
                <Stack direction={'row'} alignItems={'center'}>
                  <Typography variant="subtitle2" color="gray">
                    {translations['PlateRevoked']}
                  </Typography>
                  <Field.Switch name="plateRevoked" label="" />
                </Stack>
                {plateRevoked && (
                  <>
                    <LocalizationProvider>
                      <Field.DatePicker
                        name="plateRevokedDate"
                        label={translations['PlateRevokedDate']}
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
      {renderPrintDialog()}
    </>
  );
}
