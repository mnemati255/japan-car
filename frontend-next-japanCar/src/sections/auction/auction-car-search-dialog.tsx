import { getBrands, getColors, getModelsOfBrand } from '@/actions/base-info';
import { IBrand, IColor, IModel } from '@/types/car';
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

export default function AuctionCarSearchDialog({
  open,
  onClose,
  onApplyFilters,
  filters,
}: Props) {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [models, setModels] = useState<IModel[]>([]);
  const [colors, setColors] = useState<IColor[]>([]);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    (async () => {
      const [brandsRes, colorsRes] = await Promise.all([getBrands(), getColors()]);
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
      <DialogTitle>Search in cars</DialogTitle>
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
            <InputLabel>Brand</InputLabel>
            <Select
              name="brandId"
              label="Brand"
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
            <InputLabel>Model</InputLabel>
            <Select
              name="modelId"
              label="Model"
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
            <InputLabel>Color</InputLabel>
            <Select
              name="colorId"
              label="Color"
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
            label="Year"
            type="number"
            value={localFilters.year}
            onChange={(e) => setLocalFilters({ ...localFilters, year: e.target.value })}
          />
          <TextField
            name="chasisNumber"
            label="Chasis number"
            value={localFilters.chasisNumber}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, chasisNumber: e.target.value })
            }
          />
          <FormControl>
            <InputLabel>Fuel type</InputLabel>
            <Select
              name="fuelType"
              label="Fuel type"
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

          <Button
            variant="contained"
            sx={{ gridColumn: 'span 2' }}
            onClick={() => onApplyFilters(localFilters)}
          >
            Apply filters
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
