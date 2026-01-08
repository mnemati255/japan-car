'use client';

import { getModelsOfBrand } from '@/actions/base-info';
import { Field } from '@/components/hook-form';
import { FORSALEITEMS } from '@/constants/car-constants';
import { LocalizationProvider, useTranslateFromServer } from '@/locales';
import { IAuction } from '@/types/auction';
import { IBrand, IColor } from '@/types/car';
import { getEraYears } from '@/utils/year-utils';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import CarImages from '../car-images';

type Props = {
  methods: UseFormReturn<any>;
  colors: IColor[];
  brands: IBrand[];
  modelId?: number;
  auctions: IAuction[];
  files?: File[];
};

export function GeneralTab({
  methods,
  auctions,
  brands,
  modelId,
  colors,
  files,
}: Props) {
  const { translations } = useTranslateFromServer();
  const [models, setModels] = useState<{ value: number; label: string }[]>([]);

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

  const { control, setValue, watch } = methods;

  const purchasePrice = useWatch({ control, name: 'purchasePrice' });
  const transportPrice = useWatch({ control, name: 'transportPrice' });
  const scrapCost = useWatch({ control, name: 'scrapCost' });
  const auctionPrice = useWatch({ control, name: 'auctionPrice' });
  const engineVolume = useWatch({ control, name: 'engineVolume' });
  const brandId = useWatch({ control, name: 'brandId' });
  const sukuraNumber = useWatch({ control, name: 'sukuraNumber' });

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

  useEffect(() => {
    if (engineVolume < 1000) {
      setValue('deedRequestedDate', '');
      setValue('needsPoliceCertificate', false);
      setValue('policeCertificateRequestedDate', '');
      setValue('policeCertificateNumber', '');
      setValue('policeCertificateReceivedDate', '');
      setValue('policeDeedCertificateDeliveryDate', '');
    }
  }, [engineVolume, setValue]);

  const onSelectBrand = async (brandId: number) => {
    methods.setValue('modelId', '');
    const { status, data } = await getModelsOfBrand(brandId);
    if (status == 200) {
      setModels(
        data.map((x) => ({
          value: x.modelId!,
          label: x.modelName,
        }))
      );
      if (modelId) {
        methods.setValue('modelId', modelId);
      }
    }
  };

  useEffect(() => {
    const getModels = async () => {
      if (brandId) {
        await onSelectBrand(brandId);
      }
    };
    getModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {sukuraNumber > 0 && (
        <Box sx={{ mb: 3, gridColumn: { sx: 'span 1', sm: 'span 2' } }}>
          <Typography variant="subtitle2" color="gray">
            {translations['SukuraNumber']} :{' '}
            {methods.getValues('sukuraNumber') ?? '-----'}
          </Typography>
        </Box>
      )}

      <LocalizationProvider>
        <Field.DatePicker name="purchaseDate" label={translations['PurchaseDate']} />
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

      <Field.Text name="mileage" label={translations['Mileage']} type="number" />

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Field.Select name="year" label={translations['Year']}>
          {getEraYears().map((x) => (
            <MenuItem key={x.title} value={x.value}>
              {x.title}
            </MenuItem>
          ))}
        </Field.Select>

        <Field.Select name="manufactureMonth" label={translations['ManufactureMonth']}>
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

      <Field.Select name="forSale" label={translations['ForSale']}>
        {FORSALEITEMS.map((x) => (
          <MenuItem key={x.value} value={x.value}>
            {x.title}
          </MenuItem>
        ))}
      </Field.Select>

      <Field.Text name="grad" label={translations['Grade']} />
      <Field.Text name="point" label={translations['Point']} />

      <Field.Select name="transmissionType" label={translations['TransmissionType']}>
        {['A', 'M', 'CVT'].map((x) => (
          <MenuItem key={x} value={x}>
            {x}
          </MenuItem>
        ))}
      </Field.Select>

      <Field.Text
        name="purchasePrice"
        label={translations['PurchasePrice']}
        type="number"
        thousandSeparator={true}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>¥</Box>
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
                <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>¥</Box>
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
                <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>¥</Box>
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
                <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>¥</Box>
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
                <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>¥</Box>
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
                <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>¥</Box>
              </InputAdornment>
            ),
          },
        }}
      />

      <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
        <Field.Text
          name="description"
          label={translations['Description']}
          multiline={true}
          rows={3}
        />
        <CarImages methods={methods} files={files}/>
      </Box>
    </Box>
  );
}
