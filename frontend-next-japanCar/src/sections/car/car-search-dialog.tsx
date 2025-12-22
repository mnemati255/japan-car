import { getItems } from '@/actions/base-action';
import { getModelsOfBrand } from '@/actions/base-info';
import { PLATETYPES } from '@/constants/car-constants';
import { endpoints } from '@/lib/axios';
import { useTranslate, useTranslateFromServer } from '@/locales';
import { IBrand, IColor, IModel } from '@/types/car';
import { IGrid } from '@/types/common';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  filters: any;
};

export default function CarSearchDialog({
  open,
  onClose,
  onApplyFilters,
  filters,
}: Props) {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [models, setModels] = useState<IModel[]>([]);
  const [colors, setColors] = useState<IColor[]>([]);
  const [localFilters, setLocalFilters] = useState(filters);
  const { translations: formFields } = useTranslateFromServer();
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
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{tCommon('search')}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            py: 3,
            display: 'grid',
            rowGap: 3,
            columnGap: 2,
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
          }}
        >
          <FormControl>
            <InputLabel>{formFields['BrandName']}</InputLabel>
            <Select
              name="brandId"
              label={formFields['BrandName']}
              value={localFilters.brandId}
              onChange={(e) => {
                const brandId = +e.target.value;
                getModels(brandId);
                setLocalFilters({ ...localFilters, brandId: e.target.value });
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
            <InputLabel>{formFields['ModelName']}</InputLabel>
            <Select
              name="modelId"
              label={formFields['ModelName']}
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
            <InputLabel>{formFields['ColorId']}</InputLabel>
            <Select
              name="colorId"
              label={formFields['ColorId']}
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
            label={formFields['Year']}
            type="number"
            value={localFilters.year}
            onChange={(e) => setLocalFilters({ ...localFilters, year: e.target.value })}
          />

          <TextField
            name="month"
            label={formFields['ManufactureMonth']}
            type="number"
            value={localFilters.month}
            onChange={(e) => setLocalFilters({ ...localFilters, month: e.target.value })}
          />

          <TextField
            name="chasisNumber"
            label={formFields['ChassisNumber']}
            value={localFilters.chasisNumber}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, chasisNumber: e.target.value })
            }
          />

          <FormControl>
            <InputLabel>{formFields['FuelType']}</InputLabel>
            <Select
              name="fuelType"
              label={formFields['FuelType']}
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
            <InputLabel>{formFields['TransmissionType']}</InputLabel>
            <Select
              name="transmissionType"
              label={formFields['TransmissionType']}
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
            <InputLabel>{formFields['PlateType']}</InputLabel>
            <Select
              name="plateType"
              label={formFields['PlateType']}
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
            label={formFields['PlateNumber']}
            value={localFilters.plateNumber}
            onChange={(e) => setLocalFilters({ ...localFilters, plateNumber: e.target.value })}
          />

          <Button
            variant="contained"
            sx={{ gridColumn: 'span 2' }}
            onClick={() => onApplyFilters(localFilters)}
          >
            {tCommon('applyFilters')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
