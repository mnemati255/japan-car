import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, useForm, useWatch } from 'react-hook-form';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Form, Field } from '@/components/hook-form';
import { IBrand, ICar, IColor } from '@/types/car';
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
import { IAuction } from '@/types/auction';
import { IUser } from '@/types/user';
import { useMessage } from '@/lib/messages';
import Switch from '@mui/material/Switch';

type Props = {
  colors: IColor[];
  brands: IBrand[];
  auctions: IAuction[];
  users: IUser[];
  currentCar?: ICar;
  files?: File[];
  auctionId?: number;
};

export function CreateEditCarForm2({
  currentCar,
  colors,
  brands,
  auctions,
  users,
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

  const AUCTIONS = auctions.map((x) => ({
    value: x.auctionId,
    label: x.auctionName,
  }));

  const USERS = users.map((x) => ({
    value: x.userId,
    label: x.userName,
  }));

  const { translations } = useTranslateFromServer();
  const { t: tCommon } = useTranslate('common');
  const { messages } = useMessage();
  const [models, setModels] = useState<{ value: number; label: string }[]>([]);
  const dialog = useBoolean();

  const AuctionCarCreateSchema = z
    .object({
      purchaseDate: z.string().min(1, { error: messages.required() }),
      auctionId: z.coerce.number(),
      actionNumber: z.coerce.number().optional(),
      brandId: z.coerce.number().min(1, { error: messages.required() }),
      modelId: z.coerce.number().min(1, { error: messages.required() }),
      katashaki: z.string().min(1, { error: messages.required() }),
      chasisNumber: z.string().min(1, { error: messages.required() }),
      mileage: z.preprocess((val) => {
        if (val === '' || val === null || val === undefined) return undefined;
        return Number(val);
      }, z.number({ error: messages.required() })),
      year: z.coerce
        .number()
        .min(1900, { error: messages.invalid() })
        .max(9999, { error: messages.invalid() }),
      manufactureMonth: z.coerce
        .number()
        .min(1, { error: messages.invalid() })
        .max(12, { error: messages.invalid() }),
      fuelType: z.string().nullable().optional(),
      colorId: z.coerce.number().min(1, { error: messages.required() }),
      engineVolume: z.coerce.number().min(1, { error: messages.required() }),
      grad: z.string().optional(),
      point: z.string().optional(),
      transmissionType: z.string().nullable().optional(),
      purchasePrice: z.coerce
        .number({ error: messages.invalid() })
        .min(1, { error: messages.required() }),
      finalPrice: z.coerce.number().nullable().optional(),
      transportPrice: z.coerce
        .number({ error: messages.invalid() })
        .nullable()
        .optional(),
      auctionPrice: z.coerce.number({ error: messages.invalid() }).nullable().optional(),
      taxAmount: z.coerce.number().nullable().optional(),
      scrapCost: z.coerce.number().nullable().optional(),
      plateType: z.coerce.number(),
      plateNumber: z.string(),
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
      transportConfirmUserId: z.coerce.number().optional(),
      policeCertificateNumber: z.coerce.number().optional(),
      actionDeadlineDate: z.string().optional(),
      municipalityDeadlineDate: z.string().optional(),
      plateRevokedDeadLine: z.string().optional(),
      hasShakend: z.boolean(),
      thirdPartyInsuranceNumber: z.string().optional(),
      deedNumber: z.string().optional(),
      commandType: z.string().optional(),
      transportCompanyRequestDate: z.string().optional(),
      newPlateNumber: z.string().optional(),
      description: z.string().optional(),
      insuranceCancellationDate: z.string().optional(),
      isInsuranceCancelled: z.boolean(),
      isUnder1000CcdeedCopyUploaded: z.boolean(),
      policeDeedCertificateDeliveryDate: z.string().optional(),
      newDeedCopySentToBuyerDate: z.string().optional(),

      images: z
        .array(z.instanceof(File))
        .min(3, { error: messages.minCount3() })
        .refine(
          (files) => {
            const names = files.map((x) => x.name);
            return new Set(names).size === names.length;
          },
          {
            error: messages.duplicate(),
          }
        )
        .default([]),
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
    mode: 'all',
    resolver: zodResolver(AuctionCarCreateSchema),
    defaultValues: {
      brandId: currentCar?.brandId ?? '',
      colorId: currentCar?.colorId ?? '',
      modelId: currentCar?.modelId ?? '',
      auctionId: currentCar?.auctionId ?? '',
      year: currentCar?.year ?? '',
      mileage: currentCar?.mileage ?? '',
      katashaki: currentCar?.katashaki ?? '',
      chasisNumber: currentCar?.chasisNumber ?? '',
      engineVolume:
        currentCar?.engineVolume && currentCar?.engineVolume != 0
          ? currentCar?.engineVolume
          : '',
      fuelType: currentCar?.fuelType ?? '',
      purchasePrice: currentCar?.purchasePrice ?? '',
      taxAmount: currentCar?.taxAmount ?? '',
      transportPrice: currentCar?.transportPrice ? currentCar.transportPrice : '',
      auctionPrice: currentCar?.auctionPrice ? currentCar.auctionPrice : '',
      scrapCost: currentCar?.scrapCost ? currentCar.scrapCost : '',
      finalPrice: currentCar?.finalPrice ?? '',
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
      grad: currentCar?.grad ?? '',
      point: currentCar?.point ?? '',
      transportConfirmUserId: currentCar?.transportConfirmUserId ?? '',
      policeCertificateNumber:
        currentCar?.policeCertificateNumber && currentCar?.policeCertificateNumber != 0
          ? currentCar?.policeCertificateNumber
          : '',
      actionNumber:
        currentCar?.actionNumber && currentCar?.actionNumber != 0
          ? currentCar?.actionNumber
          : '',
      actionDeadlineDate: currentCar?.actionDeadlineDate ?? '',
      municipalityDeadlineDate: currentCar?.municipalityDeadlineDate ?? '',
      plateRevokedDeadLine: currentCar?.plateRevokedDeadLine ?? '',
      hasShakend: currentCar?.hasShakend ?? false,
      thirdPartyInsuranceNumber: currentCar?.thirdPartyInsuranceNumber ?? '',
      deedNumber: currentCar?.deedNumber ?? '',
      commandType: currentCar?.commandType ?? '',
      transportCompanyRequestDate: currentCar?.transportCompanyRequestDate ?? '',
      newPlateNumber: currentCar?.newPlateNumber ?? '',
      description: currentCar?.description ?? '',
      insuranceCancellationDate: currentCar?.insuranceCancellationDate ?? '',
      policeDeedCertificateDeliveryDate: currentCar?.thirdPartyInsuranceNumber ?? '',
      newDeedCopySentToBuyerDate: currentCar?.thirdPartyInsuranceNumber ?? '',
      isInsuranceCancelled: currentCar?.isInsuranceCancelled ?? false,
      isUnder1000CcdeedCopyUploaded: currentCar?.isUnder1000CcdeedCopyUploaded ?? false,
    },
  });

  const {
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { isSubmitting },
    clearErrors,
  } = methods;

  const onSelectBrand = useCallback(
    async (brandId: number) => {
      setValue('modelId', '');
      const { status, data } = await getModelsOfBrand(brandId);
      if (status == 200) {
        setModels(
          data.map((x) => ({
            value: x.modelId!,
            label: x.modelName,
          }))
        );
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
  const enginVolume = useWatch({ control, name: 'engineVolume' }) || 0;

  useEffect(() => {
    const p1 = Number(purchasePrice) || 0;
    const p2 = Number(transportPrice) || 0;
    const p3 = Number(auctionPrice) || 0;
    const p4 = Number(scrapCost) || 0;

    const total = p1 + p2 + p3;
    const tax = total * 0.1;

    setValue('taxAmount', tax > 0 ? (Number.isInteger(tax) ? tax : tax.toFixed(2)) : '');
    setValue('finalPrice', total + tax + p4 > 0 ? total + tax + p4 : '');
  }, [purchasePrice, transportPrice, auctionPrice, setValue, scrapCost]);

  function scrollToFirstError(errors: FieldErrors) {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const el = document.getElementById(firstErrorField);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus({ preventScroll: true });
      }
    }
  }

  const onSubmit = handleSubmit(
    async (data) => {
      try {
        const { status, data: sukuraNumber } = await createEditCar(
          data as any,
          currentCar ? currentCar.carId! : null
        );
        if (status == 200 || status == 204) {
          setValue('sukuraNumber', sukuraNumber);
          dialog.onTrue();
        }
      } catch (error) {
        console.error(error);
      }
    },
    (errors) => {
      scrollToFirstError(errors);
    }
  );

  const renderPrintDialog = () => (
    <CarPrintDialog
      open={dialog.value}
      car={methods.getValues() as any}
      auctionId={auctionId}
      isUpdated={currentCar != null}
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

                <LocalizationProvider>
                  <Field.DatePicker
                    name="purchaseDate"
                    label={translations['PurchaseDate']}
                    onChange={(e) => {
                      const purchaseDate = e?.toDate();
                      if (purchaseDate) {
                        setValue('purchaseDate', purchaseDate.toLocaleDateString());
                        clearErrors('purchaseDate');

                        const date = new Date(purchaseDate);
                        date.setMonth(date.getMonth() + 1);
                        const dateNextMonth = date.toLocaleDateString();

                        setValue('actionDeadlineDate', dateNextMonth);
                        setValue('municipalityDeadlineDate', dateNextMonth);

                        if (hasInsurance) {
                          const date2 = new Date(purchaseDate);
                          date2.setDate(date2.getDate() + 10);
                          setValue('plateRevokedDate', date2.toLocaleDateString());
                          setValue('plateRevokedDeadLine', date2.toLocaleDateString());
                        }

                        if (needsPolice) {
                          setValue('policeCertificateRequestedDate', dateNextMonth);
                          setValue('deedRequestedDate', dateNextMonth);
                          setValue('plateRegisteredDate', dateNextMonth);
                        }
                      }
                    }}
                  />
                </LocalizationProvider>

                <Field.Select name="auctionId" label={translations['AuctionName']}>
                  {AUCTIONS.map((x) => (
                    <MenuItem key={`auction_${x.value}`} value={x.value}>
                      {x.label}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Text
                  name="actionNumber"
                  label={translations['ActionNumber']}
                  type="number"
                />

                <Field.Autocomplete
                  name="brandId"
                  label={translations['BrandName']}
                  options={BRANDS}
                  getOptionKey={(option) => option.value}
                  getOptionLabel={(option) => option?.label ?? ''}
                  isOptionEqualToValue={(option, value) =>
                    option?.value === value?.value || option?.value === value
                  }
                  value={BRANDS.find((b) => b.value === watch('brandId')) ?? null}
                  onChange={(_, selected) => {
                    setValue('brandId', selected.value, { shouldValidate: true });
                    onSelectBrand(selected?.value);
                  }}
                />

                <Field.Autocomplete
                  name="modelId"
                  label={translations['ModelName']}
                  options={models}
                  getOptionKey={(option) => option.value}
                  getOptionLabel={(option) => option?.label ?? ''}
                  isOptionEqualToValue={(option, value) =>
                    option?.value === value?.value || option?.value === value
                  }
                  value={models.find((b) => b.value === watch('modelId')) ?? null}
                  onChange={(_, selected) => {
                    setValue('modelId', selected.value, { shouldValidate: true });
                  }}
                />

                <Field.Text name="katashaki" label={translations['katashaki']} />
                <Field.Text name="chasisNumber" label={translations['ChassisNumber']} />

                <Field.Text
                  name="mileage"
                  label={translations['Mileage']}
                  type="number"
                />

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Field.Text name="year" label={translations['Year']} type="number" />
                  <Field.Select
                    name="manufactureMonth"
                    label={translations['ManufactureMonth']}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <MenuItem key={i} value={i + 1}>
                        {(i + 1).toString()}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Box>

                <Field.Select name="fuelType" label={translations['FuelType']}>
                  {['CNG', 'G', 'D'].map((x) => (
                    <MenuItem key={x} value={x}>
                      {x}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Autocomplete
                  name="colorId"
                  label={translations['ColorName']}
                  options={COLORS}
                  getOptionKey={(option) => option.value}
                  getOptionLabel={(option) => option?.label ?? ''}
                  isOptionEqualToValue={(option, value) =>
                    option?.value === value?.value || option?.value === value
                  }
                  value={COLORS.find((b) => b.value === watch('colorId')) ?? null}
                  onChange={(_, selected) => {
                    setValue('colorId', selected.value, { shouldValidate: true });
                  }}
                />

                <Field.Text
                  name="engineVolume"
                  label={translations['EngineVolume']}
                  type="number"
                />

                <Field.Text name="grad" label={translations['Grade']} />
                <Field.Text name="point" label={translations['Point']} />

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
                  thousandSeparator={true}
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
                  thousandSeparator={true}
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
                  thousandSeparator={true}
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
                  label={translations['TransportPrice']}
                  type="number"
                  thousandSeparator={true}
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
                  thousandSeparator={true}
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
                  thousandSeparator={true}
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
                    {translations['HasInsurance']}
                  </Typography>
                  <Switch
                    name="hasInsurance"
                    checked={methods.getValues('hasInsurance')}
                    onChange={(e) => {
                      const value = e.target.checked;
                      setValue('hasInsurance', value);
                      if (purchaseDate && value == true) {
                        const date = new Date(purchaseDate);
                        date.setDate(date.getDate() + 10);
                        setValue('plateRevokedDate', date.toLocaleDateString());
                      }
                    }}
                  />
                </Stack>
                {hasInsurance && (
                  <>
                    <LocalizationProvider>
                      <Field.DatePicker
                        name="insuranceEndDate"
                        label={translations['InsuranceEndDate']}
                      />
                    </LocalizationProvider>

                    <FieldGroup
                      title={translations['PlateRevoking']}
                      sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
                    />
                    <LocalizationProvider>
                      <Field.DatePicker
                        name="plateRevokedDeadLine"
                        label={translations['PlateRevokedDeadLine']}
                      />
                    </LocalizationProvider>
                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography variant="subtitle2" color="gray">
                        {translations['PlateRevoked']}
                      </Typography>
                      <Field.Switch name="plateRevoked" label="" />
                    </Stack>
                    <LocalizationProvider>
                      <Field.DatePicker
                        name="plateRevokedDate"
                        label={translations['PlateRevokedDate']}
                      />
                    </LocalizationProvider>
                    <Field.Text
                      name="newPlateNumber"
                      label={translations['NewPlateNumber']}
                    />
                  </>
                )}

                <FieldGroup
                  title={translations['HasShakend']}
                  sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
                />
                <Stack direction={'row'} alignItems={'center'}>
                  <Typography variant="subtitle2" color="gray">
                    {translations['HasShakend']}
                  </Typography>
                  <Field.Switch name="hasShakend" label="" />
                </Stack>
                <Field.Text
                  name="thirdPartyInsuranceNumber"
                  label={translations['ThirdPartyInsuranceNumber']}
                />
                <Stack direction={'row'} alignItems={'center'}>
                  <Typography variant="subtitle2" color="gray">
                    {translations['IsInsuranceCancelled']}
                  </Typography>
                  <Field.Switch name="isInsuranceCancelled" label="" />
                </Stack>
                <LocalizationProvider>
                  <Field.DatePicker
                    name="insuranceCancellationDate"
                    label={translations['InsuranceCancellationDate']}
                  />
                </LocalizationProvider>

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
                <Field.Text name="deedNumber" label={translations['DeedNumber']} />
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
                      <Switch
                        name="needsPoliceCertificate"
                        checked={methods.getValues('needsPoliceCertificate')}
                        onChange={(e) => {
                          const value = e.target.checked;
                          setValue('needsPoliceCertificate', value);
                          if (purchaseDate && value == true) {
                            const date = new Date(purchaseDate);
                            date.setMonth(date.getMonth() + 1);
                            const dateNextMonth = date.toLocaleDateString();

                            setValue('policeCertificateRequestedDate', dateNextMonth);
                            setValue('deedRequestedDate', dateNextMonth);
                            setValue('plateRegisteredDate', dateNextMonth);
                          }
                        }}
                      />
                    </Stack>
                    {needsPolice && (
                      <>
                        <LocalizationProvider>
                          <Field.DatePicker
                            name="policeCertificateRequestedDate"
                            label={translations['PoliceCertificateRequestedDate']}
                          />
                        </LocalizationProvider>
                        <Field.Text
                          name="policeCertificateNumber"
                          label={translations['PoliceCertificateNumber']}
                          type="number"
                        />
                        <LocalizationProvider>
                          <Field.DatePicker
                            name="policeCertificateReceivedDate"
                            label={translations['PoliceCertificateReceivedDate']}
                          />
                        </LocalizationProvider>
                        <LocalizationProvider>
                          <Field.DatePicker
                            name="policeDeedCertificateDeliveryDate"
                            label={translations['PoliceDeedCertificateDeliveryDate']}
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

                {forSale == 2 && (
                  <Field.Select name="commandType" label={translations['CommandType']}>
                    {['F', 'S'].map((x) => (
                      <MenuItem key={x} value={x}>
                        {x}
                      </MenuItem>
                    ))}
                  </Field.Select>
                )}

                <FieldGroup
                  title={translations['Transport']}
                  sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
                />
                <LocalizationProvider>
                  <Field.DatePicker
                    name="transportDate"
                    label={translations['TransportDate']}
                  />
                </LocalizationProvider>
                <LocalizationProvider>
                  <Field.DatePicker
                    name="transportCompanyRequestDate"
                    label={translations['TransportCompanyRequestDate']}
                  />
                </LocalizationProvider>
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

                <LocalizationProvider>
                  <Field.DatePicker
                    name="transportDateReceived"
                    label={translations['TransportDateReceived']}
                  />
                </LocalizationProvider>
                <Stack direction={'row'} alignItems={'center'}>
                  <Typography variant="subtitle2" color="gray">
                    {translations['TransportConfirm']}
                  </Typography>
                  <Field.Switch name="transportConfirm" label="" />
                </Stack>
                <Field.Select
                  name="transportConfirmUserId"
                  label={translations['TransportConfirmUserId']}
                >
                  {USERS.map((x) => (
                    <MenuItem key={`user_${x.value}`} value={x.value}>
                      {x.label}
                    </MenuItem>
                  ))}
                </Field.Select>

                {Number(enginVolume) > 0 && Number(enginVolume) < 1000 && (
                  <>
                    <FieldGroup
                      title={translations['SentToMunicipality']}
                      sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
                    />
                    <LocalizationProvider>
                      <Field.DatePicker
                        name="municipalityDeadlineDate"
                        label={translations['MunicipalityDeadlineDate']}
                      />
                    </LocalizationProvider>
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
                  </>
                )}

                <FieldGroup
                  title={translations['SentToAction']}
                  sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
                />
                <LocalizationProvider>
                  <Field.DatePicker
                    name="actionDeadlineDate"
                    label={translations['ActionDeadlineDate']}
                  />
                </LocalizationProvider>
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

                <Box sx={{ mt: 8, gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                  <Field.Text
                    name="description"
                    label={translations['Description']}
                    multiline={true}
                    rows={3}
                  />
                  <Field.Upload
                    multiple
                    name="images"
                    maxSize={3145728}
                    sx={{ mt: 3 }}
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

//  import * as z from 'zod';
//  import { zodResolver } from '@hookform/resolvers/zod';
//  import { FieldErrors, useForm, useWatch } from 'react-hook-form';
//  import Box from '@mui/material/Box';
//  import Card from '@mui/material/Card';
//  import Grid from '@mui/material/Grid';
//  import Stack from '@mui/material/Stack';
//  import Button from '@mui/material/Button';
//  import { Form, Field } from '@/components/hook-form';
//  import { IBrand, ICar, IColor } from '@/types/car';
//  import MenuItem from '@mui/material/MenuItem';
//  import { createEditCar } from '@/actions/car';
//  import InputAdornment from '@mui/material/InputAdornment';
//  import { useCallback, useEffect, useState } from 'react';
//  import { getModelsOfBrand } from '@/actions/base-info';
//  import { LocalizationProvider, useTranslate, useTranslateFromServer } from '@/locales';
//  import {
//    FORSALEITEMS,
//    PLATETYPES,
//    TRANSPORTFROM,
//    TRANSPORTTO,
//  } from '@/constants/car-constants';
//  import Typography from '@mui/material/Typography';
//  import { FieldGroup } from '@/components/field-group';
//  import { CarPrintDialog } from './car-print-dialog';
//  import { useBoolean } from 'minimal-shared/hooks';
//  import { IAuction } from '@/types/auction';
//  import { IUser } from '@/types/user';
//  import { useMessage } from '@/lib/messages';
//  import Switch from '@mui/material/Switch';

//   ----------------------------------------------------------------------

//  type Props = {
//    colors: IColor[];
//    brands: IBrand[];
//    auctions: IAuction[];
//    users: IUser[];
//    currentCar?: ICar;
//    files?: File[];
//    auctionId?: number;
//  };

//  export function CreateEditCarForm({
//    currentCar,
//    colors,
//    brands,
//    auctions,
//    users,
//    files,
//    auctionId,
//  }: Props) {
//    const BRANDS = brands.map((x) => ({
//      value: x.brandId,
//      label: x.brandName,
//    }));

//    const COLORS = colors.map((x) => ({
//      value: x.colorId,
//      label: x.colorName,
//    }));

//    const AUCTIONS = auctions.map((x) => ({
//      value: x.auctionId,
//      label: x.auctionName,
//    }));

//    const USERS = users.map((x) => ({
//      value: x.userId,
//      label: x.userName,
//    }));

//    const { translations } = useTranslateFromServer();
//    const { t: tCommon } = useTranslate('common');
//    const { messages } = useMessage();
//    const [models, setModels] = useState<{ value: number; label: string }[]>([]);
//    const dialog = useBoolean();

//    const AuctionCarCreateSchema = z
//      .object({
//        purchaseDate: z.string().min(1, { error: messages.required() }),
//        auctionId: z.coerce.number(),
//        actionNumber: z.coerce.number().optional(),
//        brandId: z.coerce.number().min(1, { error: messages.required() }),
//        modelId: z.coerce.number().min(1, { error: messages.required() }),
//        katashaki: z.string().min(1, { error: messages.required() }),
//        chasisNumber: z.string().min(1, { error: messages.required() }),
//        mileage: z.preprocess((val) => {
//          if (val === '' || val === null || val === undefined) return undefined;
//          return Number(val);
//        }, z.number({ error: messages.required() })),
//        year: z.coerce
//          .number()
//          .min(1900, { error: messages.invalid() })
//          .max(9999, { error: messages.invalid() }),
//        manufactureMonth: z.coerce
//          .number()
//          .min(1, { error: messages.invalid() })
//          .max(12, { error: messages.invalid() }),
//        fuelType: z.string().nullable().optional(),
//        colorId: z.coerce.number().min(1, { error: messages.required() }),
//        engineVolume: z.coerce.number().nullable().optional(),
//        grad: z.string().optional(),
//        point: z.string().optional(),
//        transmissionType: z.string().nullable().optional(),
//        purchasePrice: z.coerce
//          .number({ error: messages.invalid() })
//          .min(1, { error: messages.required() }),
//        finalPrice: z.coerce.number().nullable().optional(),
//        transportPrice: z.coerce
//          .number({ error: messages.invalid() })
//          .nullable()
//          .optional(),
//        auctionPrice: z.coerce.number({ error: messages.invalid() }).nullable().optional(),
//        taxAmount: z.coerce.number().nullable().optional(),
//        scrapCost: z.coerce.number().nullable().optional(),
//        plateType: z.coerce.number(),
//        plateNumber: z.string(),
//        hasInsurance: z.boolean({ error: messages.required() }),
//        insuranceEndDate: z.string().optional(),
//        forSale: z.coerce.number(),
//        transportFrom: z.coerce.number(),
//        transportTo: z.coerce.number(),
//        transportConfirm: z.boolean(),
//        transportDate: z.string(),
//        transportDateReceived: z.string(),
//        needsPoliceCertificate: z.boolean(),
//        policeCertificateRequestedDate: z.string(),
//        policeCertificateReceivedDate: z.string(),
//        deedRequestedDate: z.string(),
//        deedIssuedDate: z.string(),
//        plateRegisteredDate: z.string(),
//        sukuraNumber: z.number().optional(),
//        sentToMunicipality: z.boolean(),
//        municipalitySentDate: z.string().optional(),
//        municipalitySentToPerson: z.string().optional(),
//        sentToAuction: z.boolean(),
//        auctionSentDate: z.string().optional(),
//        auctionSentToPerson: z.string().optional(),
//        plateRevoked: z.boolean(),
//        plateRevokedDate: z.string().optional(),
//        transportConfirmUserId: z.coerce.number().optional(),
//        policeCertificateNumber: z.coerce.number().optional(),
//        actionDeadlineDate: z.string().optional(),
//        municipalityDeadlineDate: z.string().optional(),
//        plateRevokedDeadLine: z.string().optional(),
//        hasShakend: z.boolean(),
//        thirdPartyInsuranceNumber: z.string().optional(),
//        deedNumber: z.string().optional(),
//        commandType: z.string().optional(),
//        transportCompanyRequestDate: z.string().optional(),
//        newPlateNumber: z.string().optional(),
//        description: z.string().optional(),
//        insuranceCancellationDate: z.string().optional(),
//        isInsuranceCancelled: z.boolean(),
//        isUnder1000CcdeedCopyUploaded: z.boolean(),
//        policeDeedCertificateDeliveryDate: z.string().optional(),
//        newDeedCopySentToBuyerDate: z.string().optional(),

//        images: z
//          .array(z.instanceof(File))
//          .min(3, { error: messages.minCount3() })
//          .refine(
//            (files) => {
//              const names = files.map((x) => x.name);
//              return new Set(names).size === names.length;
//            },
//            {
//              error: messages.duplicate(),
//            }
//          )
//          .default([]),
//      })
//      .superRefine((data, ctx) => {
//        if (data.hasInsurance && !data.insuranceEndDate) {
//          ctx.addIssue({
//            path: ['insuranceEndDate'],
//            code: 'custom',
//            message: messages.required(),
//          });
//        }
//      });

//    const methods = useForm({
//      mode: 'all',
//      resolver: zodResolver(AuctionCarCreateSchema),
//      defaultValues: {
//        brandId: currentCar?.brandId ?? '',
//        colorId: currentCar?.colorId ?? '',
//        modelId: currentCar?.modelId ?? '',
//        auctionId: currentCar?.auctionId ?? '',
//        year: currentCar?.year ?? '',
//        mileage: currentCar?.mileage ?? '',
//        katashaki: currentCar?.katashaki ?? '',
//        chasisNumber: currentCar?.chasisNumber ?? '',
//        engineVolume:
//          currentCar?.engineVolume && currentCar?.engineVolume != 0
//            ? currentCar?.engineVolume
//            : '',
//        fuelType: currentCar?.fuelType ?? '',
//        purchasePrice: currentCar?.purchasePrice ?? '',
//        taxAmount: currentCar?.taxAmount ?? '',
//        transportPrice: currentCar?.transportPrice ? currentCar.transportPrice : '',
//        auctionPrice: currentCar?.auctionPrice ? currentCar.auctionPrice : '',
//        scrapCost: currentCar?.scrapCost ? currentCar.scrapCost : '',
//        finalPrice: currentCar?.finalPrice ?? '',
//        images: [],
//        manufactureMonth: currentCar?.manufactureMonth ?? '',
//        transmissionType: currentCar?.transmissionType ?? '',
//        plateType: currentCar?.plateType ?? '',
//        plateNumber: currentCar?.plateNumber ?? '',
//        purchaseDate: currentCar?.purchaseDate ?? '',
//        hasInsurance: currentCar?.hasInsurance ?? false,
//        insuranceEndDate: currentCar?.insuranceEndDate ?? '',
//        forSale: currentCar?.forSale ?? '',
//        transportFrom: currentCar?.transportFrom ?? '',
//        transportTo: currentCar?.transportTo ?? '',
//        transportConfirm: currentCar?.transportConfirm ?? false,
//        transportDate: currentCar?.transportDate ?? '',
//        transportDateReceived: currentCar?.transportDateReceived ?? '',
//        needsPoliceCertificate: currentCar?.needsPoliceCertificate ?? false,
//        policeCertificateRequestedDate: currentCar?.policeCertificateRequestedDate ?? '',
//        policeCertificateReceivedDate: currentCar?.policeCertificateReceivedDate ?? '',
//        deedRequestedDate: currentCar?.deedRequestedDate ?? '',
//        deedIssuedDate: currentCar?.deedIssuedDate ?? '',
//        plateRegisteredDate: currentCar?.plateRegisteredDate ?? '',
//        sentToMunicipality: currentCar?.sentToMunicipality ?? false,
//        municipalitySentDate: currentCar?.municipalitySentDate ?? '',
//        municipalitySentToPerson: currentCar?.municipalitySentToPerson ?? '',
//        sentToAuction: currentCar?.sentToAuction ?? false,
//        auctionSentDate: currentCar?.auctionSentDate ?? '',
//        auctionSentToPerson: currentCar?.auctionSentToPerson ?? '',
//        plateRevoked: currentCar?.plateRevoked ?? false,
//        plateRevokedDate: currentCar?.plateRevokedDate ?? '',
//        sukuraNumber: currentCar?.sukuraNumber ?? 0,
//        grad: currentCar?.grad ?? '',
//        point: currentCar?.point ?? '',
//        transportConfirmUserId: currentCar?.transportConfirmUserId ?? '',
//        policeCertificateNumber:
//          currentCar?.policeCertificateNumber && currentCar?.policeCertificateNumber != 0
//            ? currentCar?.policeCertificateNumber
//            : '',
//        actionNumber:
//          currentCar?.actionNumber && currentCar?.actionNumber != 0
//            ? currentCar?.actionNumber
//            : '',
//        actionDeadlineDate: currentCar?.actionDeadlineDate ?? '',
//        municipalityDeadlineDate: currentCar?.municipalityDeadlineDate ?? '',
//        plateRevokedDeadLine: currentCar?.plateRevokedDeadLine ?? '',
//        hasShakend: currentCar?.hasShakend ?? false,
//        thirdPartyInsuranceNumber: currentCar?.thirdPartyInsuranceNumber ?? '',
//        deedNumber: currentCar?.deedNumber ?? '',
//        commandType: currentCar?.commandType ?? '',
//        transportCompanyRequestDate: currentCar?.transportCompanyRequestDate ?? '',
//        newPlateNumber: currentCar?.newPlateNumber ?? '',
//        description: currentCar?.description ?? '',
//        insuranceCancellationDate: currentCar?.insuranceCancellationDate ?? '',
//        policeDeedCertificateDeliveryDate: currentCar?.thirdPartyInsuranceNumber ?? '',
//        newDeedCopySentToBuyerDate: currentCar?.thirdPartyInsuranceNumber ?? '',
//        isInsuranceCancelled: currentCar?.isInsuranceCancelled ?? false,
//        isUnder1000CcdeedCopyUploaded: currentCar?.isUnder1000CcdeedCopyUploaded ?? false,
//      },
//    });

//    const {
//      handleSubmit,
//      setValue,
//      control,
//      watch,
//      formState: { isSubmitting },
//      clearErrors,
//    } = methods;

//    const onSelectBrand = useCallback(
//      async (brandId: number) => {
//        setValue('modelId', '');
//        const { status, data } = await getModelsOfBrand(brandId);
//        if (status == 200) {
//          setModels(
//            data.map((x) => ({
//              value: x.modelId!,
//              label: x.modelName,
//            }))
//          );
//        }
//      },
//      [setValue]
//    );

//    useEffect(() => {
//      if (currentCar) {
//        const getModelsInEdit = async () => {
//          await onSelectBrand(currentCar.brandId!);
//        };
//        getModelsInEdit();
//        setValue('modelId', currentCar.modelId);
//      }
//    }, [currentCar, onSelectBrand, setValue]);

//    useEffect(() => {
//      if (files && files.length > 0) {
//        setValue('images', files, { shouldValidate: true });
//      }
//    }, [files, setValue]);

//    const purchaseDate = useWatch({ control, name: 'purchaseDate' });
//    const hasInsurance = useWatch({ control, name: 'hasInsurance' });
//    const purchasePrice = useWatch({ control, name: 'purchasePrice' });
//    const transportPrice = useWatch({ control, name: 'transportPrice' });
//    const scrapCost = useWatch({ control, name: 'scrapCost' });
//    const auctionPrice = useWatch({ control, name: 'auctionPrice' });
//    const forSale = useWatch({ control, name: 'forSale' });
//    const needsPolice = useWatch({ control, name: 'needsPoliceCertificate' });
//    const plateRegisteredDate = useWatch({ control, name: 'plateRegisteredDate' });
//    const sentToMunicipality = useWatch({ control, name: 'sentToMunicipality' });
//    const sentToAuction = useWatch({ control, name: 'sentToAuction' });
//    const enginVolume = useWatch({ control, name: 'engineVolume' }) || 0;

//     useEffect(() => {
//       if (hasInsurance == true) {
//         const date = new Date(purchaseDate);
//         date.setDate(date.getDate() + 10);
//         setValue('plateRevokedDate', date.toLocaleDateString());
//       }
//     }, [hasInsurance, purchaseDate, setValue]);

//     useEffect(() => {
//       if (purchaseDate && needsPolice) {
//         const date = new Date(purchaseDate);
//         date.setMonth(date.getMonth() + 1);
//         setValue('policeCertificateRequestedDate', date.toLocaleDateString());
//         setValue('deedRequestedDate', date.toLocaleDateString());
//         setValue('plateRegisteredDate', date.toLocaleDateString());
//       }
//     }, [needsPolice, purchaseDate, setValue]);

//     useEffect(() => {
//       if (purchaseDate) {
//         const date = new Date(purchaseDate);
//         date.setMonth(date.getMonth() + 1);
//         setValue('actionDeadlineDate', date.toLocaleDateString());
//         setValue('municipalityDeadlineDate', date.toLocaleDateString());
//       }
//     }, [purchaseDate, setValue]);

//    useEffect(() => {
//      const p1 = Number(purchasePrice) || 0;
//      const p2 = Number(transportPrice) || 0;
//      const p3 = Number(auctionPrice) || 0;
//      const p4 = Number(scrapCost) || 0;

//      const total = p1 + p2 + p3;
//      const tax = total * 0.1;

//      setValue('taxAmount', tax > 0 ? (Number.isInteger(tax) ? tax : tax.toFixed(2)) : '');
//      setValue('finalPrice', total + tax + p4 > 0 ? total + tax + p4 : '');
//    }, [purchasePrice, transportPrice, auctionPrice, setValue, scrapCost]);

//    function scrollToFirstError(errors: FieldErrors) {
//      const firstErrorField = Object.keys(errors)[0];
//      if (firstErrorField) {
//        const el = document.getElementById(firstErrorField);
//        if (el) {
//          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
//           el.focus({ preventScroll: true });  فوکوس هم بزنه
//        }
//      }
//    }

//    const onSubmit = handleSubmit(
//      async (data) => {
//        console.log(1);
//        try {
//          const { status, data: sukuraNumber } = await createEditCar(
//            data,
//            auctionId ?? null,
//            currentCar ? currentCar.carId! : null
//          );
//          if (status == 200 || status == 204) {
//            setValue('sukuraNumber', sukuraNumber);
//            dialog.onTrue();
//          }
//        } catch (error) {
//          console.error(error);
//        }
//      },
//      (errors) => {
//        scrollToFirstError(errors);
//      }
//    );

//    const renderPrintDialog = () => (
//      <CarPrintDialog
//        open={dialog.value}
//        car={methods.getValues() as ICar}
//        auctionId={auctionId}
//        isUpdated={currentCar != null}
//      />
//    );

//    return (
//      <>
//        <Form methods={methods} onSubmit={onSubmit}>
//          <Grid container spacing={3}>
//            <Grid size={{ xs: 12, md: 12 }}>
//              <Card sx={{ p: 3 }}>
//                <Box
//                  sx={{
//                    rowGap: 3,
//                    columnGap: 2,
//                    display: 'grid',
//                    gridTemplateColumns: {
//                      xs: 'repeat(1, 1fr)',
//                      sm: 'repeat(2, 1fr)',
//                    },
//                  }}
//                >
//                  <FieldGroup
//                    title={translations['General']}
//                    sx={{ gridColumn: { sx: 'span 1', sm: 'span 2' } }}
//                  />

//                  <Box sx={{ mb: 3, gridColumn: { sx: 'span 1', sm: 'span 2' } }}>
//                    <Typography variant="subtitle2" color="gray">
//                      {translations['SukuraNumber']} :{' '}
//                      {methods.getValues('sukuraNumber') ?? '-----'}
//                    </Typography>
//                  </Box>

//                  <LocalizationProvider>
//                    <Field.DatePicker
//                      name="purchaseDate"
//                      label={translations['PurchaseDate']}
//                      onChange={(e) => {
//                        const purchaseDate = e?.toDate();
//                        if (purchaseDate) {
//                          setValue('purchaseDate', purchaseDate.toLocaleDateString());
//                          clearErrors('purchaseDate');

//                          const date = new Date(purchaseDate);
//                          date.setMonth(date.getMonth() + 1);
//                          const dateNextMonth = date.toLocaleDateString();

//                          setValue('actionDeadlineDate', dateNextMonth);
//                          setValue('municipalityDeadlineDate', dateNextMonth);

//                          if (hasInsurance) {
//                            const date2 = new Date(purchaseDate);
//                            date2.setDate(date2.getDate() + 10);
//                            setValue('plateRevokedDate', date2.toLocaleDateString());
//                            setValue('plateRevokedDeadLine', date2.toLocaleDateString());
//                          }

//                          if (needsPolice) {
//                            setValue('policeCertificateRequestedDate', dateNextMonth);
//                            setValue('deedRequestedDate', dateNextMonth);
//                            setValue('plateRegisteredDate', dateNextMonth);
//                          }
//                        }
//                      }}
//                    />
//                  </LocalizationProvider>

//                  <Field.Select name="auctionId" label={translations['AuctionName']}>
//                    {AUCTIONS.map((x) => (
//                      <MenuItem key={`auction_${x.value}`} value={x.value}>
//                        {x.label}
//                      </MenuItem>
//                    ))}
//                  </Field.Select>

//                  <Field.Text
//                    name="actionNumber"
//                    label={translations['ActionNumber']}
//                    type="number"
//                  />

//                  <Field.Autocomplete
//                    name="brandId"
//                    label={translations['BrandName']}
//                    options={BRANDS}
//                    getOptionKey={(option) => option.value}
//                    getOptionLabel={(option) => option?.label ?? ''}
//                    isOptionEqualToValue={(option, value) =>
//                      option?.value === value?.value || option?.value === value
//                    }
//                    value={BRANDS.find((b) => b.value === watch('brandId')) ?? null}
//                    onChange={(_, selected) => {
//                      setValue('brandId', selected.value, { shouldValidate: true });
//                      onSelectBrand(selected?.value);
//                    }}
//                  />

//                  <Field.Autocomplete
//                    name="modelId"
//                    label={translations['ModelName']}
//                    options={models}
//                    getOptionKey={(option) => option.value}
//                    getOptionLabel={(option) => option?.label ?? ''}
//                    isOptionEqualToValue={(option, value) =>
//                      option?.value === value?.value || option?.value === value
//                    }
//                    value={models.find((b) => b.value === watch('modelId')) ?? null}
//                    onChange={(_, selected) => {
//                      setValue('modelId', selected.value, { shouldValidate: true });
//                    }}
//                  />

//                  <Field.Text name="katashaki" label={translations['katashaki']} />
//                  <Field.Text name="chasisNumber" label={translations['ChassisNumber']} />

//                  <Field.Text
//                    name="mileage"
//                    label={translations['Mileage']}
//                    type="number"
//                  />

//                  <Box sx={{ display: 'flex', gap: 1 }}>
//                    <Field.Text name="year" label={translations['Year']} type="number" />
//                    <Field.Select
//                      name="manufactureMonth"
//                      label={translations['ManufactureMonth']}
//                    >
//                      {Array.from({ length: 12 }, (_, i) => (
//                        <MenuItem key={i} value={i + 1}>
//                          {(i + 1).toString()}
//                        </MenuItem>
//                      ))}
//                    </Field.Select>
//                  </Box>

//                  <Field.Select name="fuelType" label={translations['FuelType']}>
//                    {['CNG', 'G', 'D'].map((x) => (
//                      <MenuItem key={x} value={x}>
//                        {x}
//                      </MenuItem>
//                    ))}
//                  </Field.Select>

//                  <Field.Autocomplete
//                    name="colorId"
//                    label={translations['ColorName']}
//                    options={COLORS}
//                    getOptionKey={(option) => option.value}
//                    getOptionLabel={(option) => option?.label ?? ''}
//                    isOptionEqualToValue={(option, value) =>
//                      option?.value === value?.value || option?.value === value
//                    }
//                    value={COLORS.find((b) => b.value === watch('colorId')) ?? null}
//                    onChange={(_, selected) => {
//                      setValue('colorId', selected.value, { shouldValidate: true });
//                    }}
//                  />

//                  <Field.Text
//                    name="engineVolume"
//                    label={translations['EngineVolume']}
//                    type="number"
//                  />

//                  <Field.Text name="grad" label={translations['Grade']} />
//                  <Field.Text name="point" label={translations['Point']} />

//                  <Field.Select
//                    name="transmissionType"
//                    label={translations['TransmissionType']}
//                  >
//                    {['A', 'M', 'CVT'].map((x) => (
//                      <MenuItem key={x} value={x}>
//                        {x}
//                      </MenuItem>
//                    ))}
//                  </Field.Select>

//                  <FieldGroup
//                    title={translations['Prices']}
//                    sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
//                  />
//                  <Field.Text
//                    name="purchasePrice"
//                    label={translations['PurchasePrice']}
//                    type="number"
//                    thousandSeparator={true}
//                    slotProps={{
//                      input: {
//                        startAdornment: (
//                          <InputAdornment position="start">
//                            <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
//                              ¥
//                            </Box>
//                          </InputAdornment>
//                        ),
//                      },
//                    }}
//                  />
//                  <Field.Text
//                    name="scrapCost"
//                    label={translations['ScrapCost']}
//                    type="number"
//                    thousandSeparator={true}
//                    slotProps={{
//                      input: {
//                        startAdornment: (
//                          <InputAdornment position="start">
//                            <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
//                              ¥
//                            </Box>
//                          </InputAdornment>
//                        ),
//                      },
//                    }}
//                  />
//                  <Field.Text
//                    name="auctionPrice"
//                    label={translations['AuctionPrice']}
//                    type="number"
//                    thousandSeparator={true}
//                    slotProps={{
//                      input: {
//                        startAdornment: (
//                          <InputAdornment position="start">
//                            <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
//                              ¥
//                            </Box>
//                          </InputAdornment>
//                        ),
//                      },
//                    }}
//                  />
//                  <Field.Text
//                    name="transportPrice"
//                    label={translations['TransportPrice']}
//                    type="number"
//                    thousandSeparator={true}
//                    slotProps={{
//                      input: {
//                        startAdornment: (
//                          <InputAdornment position="start">
//                            <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
//                              ¥
//                            </Box>
//                          </InputAdornment>
//                        ),
//                      },
//                    }}
//                  />
//                  <Field.Text
//                    name="taxAmount"
//                    label={translations['TaxAmount']}
//                    type="number"
//                    thousandSeparator={true}
//                    disabled
//                    slotProps={{
//                      input: {
//                        startAdornment: (
//                          <InputAdornment position="start">
//                            <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
//                              ¥
//                            </Box>
//                          </InputAdornment>
//                        ),
//                      },
//                    }}
//                  />
//                  <Field.Text
//                    name="finalPrice"
//                    label={translations['FinalPrice']}
//                    type="number"
//                    thousandSeparator={true}
//                    disabled
//                    slotProps={{
//                      input: {
//                        startAdornment: (
//                          <InputAdornment position="start">
//                            <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
//                              ¥
//                            </Box>
//                          </InputAdornment>
//                        ),
//                      },
//                    }}
//                  />

//                  <FieldGroup
//                    title={translations['Insurance']}
//                    sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
//                  />
//                  <Stack direction={'row'} alignItems={'center'}>
//                    <Typography variant="subtitle2" color="gray">
//                      {translations['HasInsurance']}
//                    </Typography>
//                    <Switch
//                      name="hasInsurance"
//                      checked={methods.getValues('hasInsurance')}
//                      onChange={(e) => {
//                        const value = e.target.checked;
//                        setValue('hasInsurance', value);
//                        if (purchaseDate && value == true) {
//                          const date = new Date(purchaseDate);
//                          date.setDate(date.getDate() + 10);
//                          setValue('plateRevokedDate', date.toLocaleDateString());
//                        }
//                      }}
//                    />
//                  </Stack>
//                  {hasInsurance && (
//                    <>
//                      <LocalizationProvider>
//                        <Field.DatePicker
//                          name="insuranceEndDate"
//                          label={translations['InsuranceEndDate']}
//                        />
//                      </LocalizationProvider>

//                      <FieldGroup
//                        title={translations['PlateRevoking']}
//                        sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
//                      />
//                      <LocalizationProvider>
//                        <Field.DatePicker
//                          name="plateRevokedDeadLine"
//                          label={translations['PlateRevokedDeadLine']}
//                        />
//                      </LocalizationProvider>
//                      <Stack direction={'row'} alignItems={'center'}>
//                        <Typography variant="subtitle2" color="gray">
//                          {translations['PlateRevoked']}
//                        </Typography>
//                        <Field.Switch name="plateRevoked" label="" />
//                      </Stack>
//                      <LocalizationProvider>
//                        <Field.DatePicker
//                          name="plateRevokedDate"
//                          label={translations['PlateRevokedDate']}
//                        />
//                      </LocalizationProvider>
//                      <Field.Text
//                        name="newPlateNumber"
//                        label={translations['NewPlateNumber']}
//                      />
//                    </>
//                  )}

//                  <FieldGroup
//                    title={translations['HasShakend']}
//                    sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
//                  />
//                  <Stack direction={'row'} alignItems={'center'}>
//                    <Typography variant="subtitle2" color="gray">
//                      {translations['HasShakend']}
//                    </Typography>
//                    <Field.Switch name="hasShakend" label="" />
//                  </Stack>
//                  <Field.Text
//                    name="thirdPartyInsuranceNumber"
//                    label={translations['ThirdPartyInsuranceNumber']}
//                  />
//                  <Stack direction={'row'} alignItems={'center'}>
//                    <Typography variant="subtitle2" color="gray">
//                      {translations['IsInsuranceCancelled']}
//                    </Typography>
//                    <Field.Switch name="isInsuranceCancelled" label="" />
//                  </Stack>
//                  <LocalizationProvider>
//                    <Field.DatePicker
//                      name="insuranceCancellationDate"
//                      label={translations['InsuranceCancellationDate']}
//                    />
//                  </LocalizationProvider>

//                  <FieldGroup
//                    title={translations['Deed']}
//                    sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
//                  />
//                  <LocalizationProvider>
//                    <Field.DatePicker
//                      name="deedRequestedDate"
//                      label={translations['DeedRequestedDate']}
//                    />
//                  </LocalizationProvider>
//                  <LocalizationProvider>
//                    <Field.DatePicker
//                      name="deedIssuedDate"
//                      label={translations['DeedIssuedDate']}
//                    />
//                  </LocalizationProvider>
//                  <LocalizationProvider>
//                    <Field.DatePicker
//                      name="plateRegisteredDate"
//                      label={translations['PlateRegisteredDate']}
//                    />
//                  </LocalizationProvider>
//                  <Field.Text name="deedNumber" label={translations['DeedNumber']} />
//                  <LocalizationProvider>
//                    <Field.DatePicker
//                      name="newDeedCopySentToBuyerDate"
//                      label={translations['NewDeedCopySentToBuyerDate']}
//                    />
//                  </LocalizationProvider>
//                  <Stack direction={'row'} alignItems={'center'}>
//                    <Typography variant="subtitle2" color="gray">
//                      {translations['IsUnder1000CCDeedCopyUploaded']}
//                    </Typography>
//                    <Field.Switch name="isUnder1000CcdeedCopyUploaded" label="" />
//                  </Stack>

//                  <FieldGroup
//                    title={translations['PoliceCertificate']}
//                    sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
//                  />
//                  <Field.Select name="forSale" label={translations['ForSale']}>
//                    {FORSALEITEMS.map((x) => (
//                      <MenuItem key={x.value} value={x.value}>
//                        {x.title}
//                      </MenuItem>
//                    ))}
//                  </Field.Select>
//                  {forSale == 1 && (
//                    <>
//                      <Stack direction={'row'} alignItems={'center'}>
//                        <Typography variant="subtitle2" color="gray">
//                          {translations['NeedsPoliceCertificate']}
//                        </Typography>
//                        <Switch
//                          name="needsPoliceCertificate"
//                          checked={methods.getValues('needsPoliceCertificate')}
//                          onChange={(e) => {
//                            const value = e.target.checked;
//                            setValue('needsPoliceCertificate', value);
//                            if (purchaseDate && value == true) {
//                              const date = new Date(purchaseDate);
//                              date.setMonth(date.getMonth() + 1);
//                              const dateNextMonth = date.toLocaleDateString();

//                              setValue('policeCertificateRequestedDate', dateNextMonth);
//                              setValue('deedRequestedDate', dateNextMonth);
//                              setValue('plateRegisteredDate', dateNextMonth);
//                            }
//                          }}
//                        />
//                      </Stack>
//                      {needsPolice && (
//                        <>
//                          <LocalizationProvider>
//                            <Field.DatePicker
//                              name="policeCertificateRequestedDate"
//                              label={translations['PoliceCertificateRequestedDate']}
//                            />
//                          </LocalizationProvider>
//                          <Field.Text
//                            name="policeCertificateNumber"
//                            label={translations['PoliceCertificateNumber']}
//                            type="number"
//                          />
//                          <LocalizationProvider>
//                            <Field.DatePicker
//                              name="policeCertificateReceivedDate"
//                              label={translations['PoliceCertificateReceivedDate']}
//                            />
//                          </LocalizationProvider>
//                          <LocalizationProvider>
//                            <Field.DatePicker
//                              name="policeDeedCertificateDeliveryDate"
//                              label={translations['PoliceDeedCertificateDeliveryDate']}
//                            />
//                          </LocalizationProvider>
//                        </>
//                      )}
//                      {plateRegisteredDate && (
//                        <>
//                          <Field.Select name="plateType" label={translations['PlateType']}>
//                            {PLATETYPES.map((x) => (
//                              <MenuItem key={x.value} value={x.value}>
//                                {x.title}
//                              </MenuItem>
//                            ))}
//                          </Field.Select>

//                          <Field.Text
//                            name="plateNumber"
//                            label={translations['PlateNumber']}
//                          />
//                        </>
//                      )}
//                    </>
//                  )}

//                  {forSale == 2 && (
//                    <Field.Select name="commandType" label={translations['CommandType']}>
//                      {['F', 'S'].map((x) => (
//                        <MenuItem key={x} value={x}>
//                          {x}
//                        </MenuItem>
//                      ))}
//                    </Field.Select>
//                  )}

//                  <FieldGroup
//                    title={translations['Transport']}
//                    sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
//                  />
//                  <LocalizationProvider>
//                    <Field.DatePicker
//                      name="transportDate"
//                      label={translations['TransportDate']}
//                    />
//                  </LocalizationProvider>
//                  <LocalizationProvider>
//                    <Field.DatePicker
//                      name="transportCompanyRequestDate"
//                      label={translations['TransportCompanyRequestDate']}
//                    />
//                  </LocalizationProvider>
//                  <Field.Select name="transportFrom" label={translations['TransportFrom']}>
//                    {TRANSPORTFROM.map((x) => (
//                      <MenuItem key={x.value} value={x.value}>
//                        {x.title}
//                      </MenuItem>
//                    ))}
//                  </Field.Select>
//                  <Field.Select name="transportTo" label={translations['TransportTo']}>
//                    {TRANSPORTTO.map((x) => (
//                      <MenuItem key={x.value} value={x.value}>
//                        {x.title}
//                      </MenuItem>
//                    ))}
//                  </Field.Select>

//                  <LocalizationProvider>
//                    <Field.DatePicker
//                      name="transportDateReceived"
//                      label={translations['TransportDateReceived']}
//                    />
//                  </LocalizationProvider>
//                  <Stack direction={'row'} alignItems={'center'}>
//                    <Typography variant="subtitle2" color="gray">
//                      {translations['TransportConfirm']}
//                    </Typography>
//                    <Field.Switch name="transportConfirm" label="" />
//                  </Stack>
//                  <Field.Select
//                    name="transportConfirmUserId"
//                    label={translations['TransportConfirmUserId']}
//                  >
//                    {USERS.map((x) => (
//                      <MenuItem key={`user_${x.value}`} value={x.value}>
//                        {x.label}
//                      </MenuItem>
//                    ))}
//                  </Field.Select>

//                  {Number(enginVolume) > 0 && Number(enginVolume) < 1000 && (
//                    <>
//                      <FieldGroup
//                        title={translations['SentToMunicipality']}
//                        sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
//                      />
//                      <LocalizationProvider>
//                        <Field.DatePicker
//                          name="municipalityDeadlineDate"
//                          label={translations['MunicipalityDeadlineDate']}
//                        />
//                      </LocalizationProvider>
//                      <Stack direction={'row'} alignItems={'center'}>
//                        <Typography variant="subtitle2" color="gray">
//                          {translations['SentToMunicipality']}
//                        </Typography>
//                        <Field.Switch name="sentToMunicipality" label="" />
//                      </Stack>
//                      {sentToMunicipality && (
//                        <>
//                          <LocalizationProvider>
//                            <Field.DatePicker
//                              name="municipalitySentDate"
//                              label={translations['MunicipalitySentDate']}
//                            />
//                          </LocalizationProvider>
//                          <Field.Text
//                            name="municipalitySentToPerson"
//                            label={translations['MunicipalitySentToPerson']}
//                          />
//                        </>
//                      )}
//                    </>
//                  )}

//                  <FieldGroup
//                    title={translations['SentToAction']}
//                    sx={{ marginTop: 8, gridColumn: { sx: 'span 1', sm: 'span 2' } }}
//                  />
//                  <LocalizationProvider>
//                    <Field.DatePicker
//                      name="actionDeadlineDate"
//                      label={translations['ActionDeadlineDate']}
//                    />
//                  </LocalizationProvider>
//                  <Stack direction={'row'} alignItems={'center'}>
//                    <Typography variant="subtitle2" color="gray">
//                      {translations['SentToAction']}
//                    </Typography>
//                    <Field.Switch name="sentToAuction" label="" />
//                  </Stack>
//                  {sentToAuction && (
//                    <>
//                      <LocalizationProvider>
//                        <Field.DatePicker
//                          name="auctionSentDate"
//                          label={translations['ActionSentDate']}
//                        />
//                      </LocalizationProvider>
//                      <Field.Text
//                        name="auctionSentToPerson"
//                        label={translations['ActionSentToPerson']}
//                      />
//                    </>
//                  )}

//                  <Box sx={{ mt: 8, gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
//                    <Field.Text
//                      name="description"
//                      label={translations['Description']}
//                      multiline={true}
//                      rows={3}
//                    />
//                    <Field.Upload
//                      multiple
//                      name="images"
//                      maxSize={3145728}
//                      sx={{ mt: 3 }}
//                      onRemove={(inputFile) =>
//                        setValue(
//                          'images',
//                          methods.getValues('images')!.filter((file) => file !== inputFile),
//                          { shouldValidate: true }
//                        )
//                      }
//                      onRemoveAll={() => setValue('images', [], { shouldValidate: true })}
//                    />
//                  </Box>
//                </Box>

//                <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
//                  <Button type="submit" variant="contained" loading={isSubmitting}>
//                    {!currentCar
//                      ? `${tCommon('create')} ${tCommon('car.car')}`
//                      : tCommon('save')}
//                  </Button>
//                </Stack>
//              </Card>
//            </Grid>
//          </Grid>
//        </Form>
//        {renderPrintDialog()}
//      </>
//    );
//  }
