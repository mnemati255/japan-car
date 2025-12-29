import { getItems } from '@/actions/base-action';
import { getModelsOfBrand } from '@/actions/base-info';
import { PLATETYPES } from '@/constants/car-constants';
import { endpoints } from '@/lib/axios';
import { LocalizationProvider, useTranslate, useTranslateFromServer } from '@/locales';
import { IBrand, ICarFilter, IColor, IModel } from '@/types/car';
import { IGrid } from '@/types/common';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  filters: any;
};

export default function CarReportSearchDialog({
  open,
  onClose,
  onApplyFilters,
  filters,
}: Props) {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [models, setModels] = useState<IModel[]>([]);
  const [colors, setColors] = useState<IColor[]>([]);
  const [localFilters, setLocalFilters] = useState<ICarFilter>(filters);
  const { translations } = useTranslateFromServer();
  const { t: tCommon } = useTranslate('common');

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    (async () => {
      const [brandsRes, colorsRes] = await Promise.all([
        getItems<IGrid<IBrand>>(endpoints.baseInfo.brand),
        getItems<IGrid<IColor>>(endpoints.baseInfo.color),
      ]);
      if (brandsRes.status === 200) setBrands(brandsRes.data.items);
      if (colorsRes.status === 200) setColors(colorsRes.data.items);
    })();
  }, []);

  const getModels = async (brandId: number) => {
    try {
      const { status, data } = await getModelsOfBrand(brandId);
      if (status == 200) {
        setModels(data);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{tCommon('search')}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            py: 3,
            display: 'grid',
            rowGap: 3,
            columnGap: 2,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          <FormControl>
            <InputLabel>{translations['BrandName']}</InputLabel>
            <Select
              name="brandId"
              label={translations['BrandName']}
              value={localFilters.brandId}
              onChange={(e) => {
                const brandId = e.target.value;
                getModels(+brandId!);
                setLocalFilters({ ...localFilters, brandId: e.target.value! });
              }}
            >
              {brands.map((x) => (
                <MenuItem key={x.brandId} value={x.brandId}>
                  {x.brandName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel>{translations['ModelName']}</InputLabel>
            <Select
              name="modelId"
              label={translations['ModelName']}
              value={localFilters.modelId}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, modelId: e.target.value })
              }
            >
              {models.map((x) => (
                <MenuItem key={x.modelId} value={x.modelId}>
                  {x.modelName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel>{translations['ColorId']}</InputLabel>
            <Select
              name="colorId"
              label={translations['ColorId']}
              value={localFilters.colorId}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, colorId: e.target.value })
              }
            >
              {colors.map((x) => (
                <MenuItem key={x.colorId} value={x.colorId}>
                  {x.colorName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="year"
            label={translations['Year']}
            type="number"
            value={localFilters.year}
            onChange={(e) => setLocalFilters({ ...localFilters, year: e.target.value })}
          />

          <TextField
            name="katashaki"
            label={translations['katashaki']}
            value={localFilters.katashaki}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, katashaki: e.target.value })
            }
          />

          <TextField
            name="chasisNumber"
            label={translations['ChassisNumber']}
            value={localFilters.chasisNumber}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, chasisNumber: e.target.value })
            }
          />

          <FormControl>
            <InputLabel>{translations['FuelType']}</InputLabel>
            <Select
              name="fuelType"
              label={translations['FuelType']}
              value={localFilters.fuelType}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, fuelType: e.target.value })
              }
            >
              {['CNG', 'G', 'D'].map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel>{translations['TransmissionType']}</InputLabel>
            <Select
              name="transmissionType"
              label={translations['TransmissionType']}
              value={localFilters.transmissionType}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, transmissionType: e.target.value })
              }
            >
              {['A', 'M', 'CVT'].map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel>{translations['PlateType']}</InputLabel>
            <Select
              name="plateType"
              label={translations['PlateType']}
              value={localFilters.plateType}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, plateType: e.target.value })
              }
            >
              {PLATETYPES.map((x) => (
                <MenuItem key={x.value} value={x.value}>
                  {x.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="plateNumber"
            label={translations['PlateNumber']}
            value={localFilters.plateNumber}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, plateNumber: e.target.value })
            }
          />

          <LocalizationProvider>
            <DatePicker
              format="YYYY/MM/DD"
              name="purchaseDateFrom"
              label={translations['PurchaseDateFrom']}
              value={
                localFilters.purchaseDateFrom !== ''
                  ? dayjs(localFilters.purchaseDateFrom)
                  : null
              }
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  purchaseDateFrom: e?.toDate().toLocaleDateString(),
                })
              }
            />
          </LocalizationProvider>

          <LocalizationProvider>
            <DatePicker
              format="YYYY/MM/DD"
              name="purchaseDateTo"
              label={translations['PurchaseDateTo']}
              value={
                localFilters.purchaseDateTo !== ''
                  ? dayjs(localFilters.purchaseDateTo)
                  : null
              }
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  purchaseDateTo: e?.toDate().toLocaleDateString(),
                })
              }
            />
          </LocalizationProvider>

          <TextField
            name="purchasePriceFrom"
            label={translations['PurchasePriceFrom']}
            type="number"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>¥</Box>
                  </InputAdornment>
                ),
              },
            }}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, purchasePriceFrom: e.target.value })
            }
          />

          <TextField
            name="purchasePriceTo"
            label={translations['PurchasePriceTo']}
            type="number"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>¥</Box>
                  </InputAdornment>
                ),
              },
            }}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, purchasePriceTo: e.target.value })
            }
          />

          <FormControl>
            <InputLabel>{translations['TransmissionType']}</InputLabel>
            <Select
              name="hasPoliceCertificate"
              label={translations['HasPoliceCertificate']}
              value={localFilters.hasPoliceCertificate}
              onChange={(e) => {
                setLocalFilters({
                  ...localFilters,
                  hasPoliceCertificate: e.target.value,
                });
              }}
            >
              {['', 'Yes', 'No'].map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider>
            <DatePicker
              format="YYYY/MM/DD"
              name="transportDateFrom"
              label={translations['TransportDateFrom']}
              value={
                localFilters.transportDateFrom !== ''
                  ? dayjs(localFilters.transportDateFrom)
                  : null
              }
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  transportDateFrom: e?.toDate().toLocaleDateString(),
                })
              }
            />
          </LocalizationProvider>

          <LocalizationProvider>
            <DatePicker
              format="YYYY/MM/DD"
              name="transportDateTo"
              label={translations['TransportDateTo']}
              value={
                localFilters.transportDateTo !== ''
                  ? dayjs(localFilters.transportDateTo)
                  : null
              }
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  transportDateTo: e?.toDate().toLocaleDateString(),
                })
              }
            />
          </LocalizationProvider>

          <LocalizationProvider>
            <DatePicker
              format="YYYY/MM/DD"
              name="policeCertificateReceivedDateFrom"
              label={translations['PoliceCertificateReceivedDateFrom']}
              value={
                localFilters.policeCertificateReceivedDateFrom !== ''
                  ? dayjs(localFilters.policeCertificateReceivedDateFrom)
                  : null
              }
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  policeCertificateReceivedDateFrom: e?.toDate().toLocaleDateString(),
                })
              }
            />
          </LocalizationProvider>

          <LocalizationProvider>
            <DatePicker
              format="YYYY/MM/DD"
              name="policeCertificateReceivedDateTo"
              label={translations['PoliceCertificateReceivedDateTo']}
              value={
                localFilters.policeCertificateReceivedDateTo !== ''
                  ? dayjs(localFilters.policeCertificateReceivedDateTo)
                  : null
              }
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  policeCertificateReceivedDateTo: e?.toDate().toLocaleDateString(),
                })
              }
            />
          </LocalizationProvider>

          <LocalizationProvider>
            <DatePicker
              format="YYYY/MM/DD"
              name="municipalitySentDateFrom"
              label={translations['MunicipalitySentDateFrom']}
              value={
                localFilters.municipalitySentDateFrom !== ''
                  ? dayjs(localFilters.municipalitySentDateFrom)
                  : null
              }
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  municipalitySentDateFrom: e?.toDate().toLocaleDateString(),
                })
              }
            />
          </LocalizationProvider>

          <LocalizationProvider>
            <DatePicker
              format="YYYY/MM/DD"
              name="municipalitySentDateTo"
              label={translations['MunicipalitySentDateTo']}
              value={
                localFilters.municipalitySentDateTo !== ''
                  ? dayjs(localFilters.municipalitySentDateTo)
                  : null
              }
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  municipalitySentDateTo: e?.toDate().toLocaleDateString(),
                })
              }
            />
          </LocalizationProvider>
        </Box>

        <Box sx={{ mb: 2, textAlign: 'right' }}>
          <Button variant="contained" onClick={() => onApplyFilters(localFilters)}>
            {tCommon('applyFilters')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
