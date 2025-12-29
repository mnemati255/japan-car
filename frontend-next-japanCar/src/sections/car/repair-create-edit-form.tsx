import { createItem, updateItem } from '@/actions/base-action';
import { Field, Form } from '@/components/hook-form';
import { Iconify } from '@/components/iconify';
import { Scrollbar } from '@/components/scrollbar';
import { endpoints } from '@/lib/axios';
import { useMessage } from '@/lib/messages';
import {
  LangCode,
  LocalizationProvider,
  useTranslate,
  useTranslateFromServer,
} from '@/locales';
import { useRouter } from '@/routes/hooks';
import { paths } from '@/routes/paths';
import { ICar } from '@/types/car';
import { IMechanic } from '@/types/mechanic';
import { IPart } from '@/types/part';
import { IRepair } from '@/types/repair';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

type Props = {
  car: ICar;
  parts: IPart[];
  mechanics: IMechanic[];
  currentRepair?: IRepair;
  lang: LangCode;
};

const CarPartSchema = z.object({
  carPartId: z.number(),
  partId: z.number().min(1, { error: '' }),
  partCost: z.number().min(1, { error: '' }),
  partCount: z.number().min(1, { error: '' }),
  mechanicId: z.number(),
});

export function RepairCreateEditForm({
  car,
  mechanics,
  parts,
  currentRepair,
  lang,
}: Props) {
  const { translations } = useTranslateFromServer();
  const { t: tCommon } = useTranslate('common');
  const router = useRouter();
  const { messages } = useMessage();

  const RepairSchema = z.object({
    carId: z.coerce.number(),
    repairDate: z.string().min(1, { error: messages.required() }),
    mechanicId: z.preprocess((val) => (val === '' ? null : val), z.number().nullable()),
    dashboardReplacerId: z.preprocess(
      (val) => (val === '' ? null : val),
      z.number().nullable()
    ),
    steeringReplacerId: z.preprocess(
      (val) => (val === '' ? null : val),
      z.number().nullable()
    ),
    mechanicTechnicalNote: z.preprocess(
      (val) => (val === '' ? null : val),
      z.string().nullable()
    ),
    parts: z.array(CarPartSchema).default([]),
    mechanicLaborCost: z.coerce.number(),
    mechanicWorkHours: z.coerce.number(),
  });

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(RepairSchema),
    defaultValues: {
      carId: '',
      mechanicId: currentRepair?.mechanicId ?? '',
      dashboardReplacerId: currentRepair?.dashboardReplacerId ?? '',
      steeringReplacerId: currentRepair?.steeringReplacerId ?? '',
      mechanicTechnicalNote: currentRepair?.mechanicTechnicalNote ?? '',
      repairDate: currentRepair?.repairDate ?? '',
      parts: currentRepair?.parts ?? [],
      mechanicLaborCost: currentRepair?.mechanicLaborCost ?? '',
      mechanicWorkHours: currentRepair?.mechanicWorkHours ?? '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    setValue,
  } = methods;

  const {
    fields: repairedParts,
    append,
    remove,
  } = useFieldArray({ control, name: 'parts' });

  useEffect(() => {
    if (car) {
      setValue('carId', car.carId);
    }
  }, [car, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const api = !currentRepair
        ? createItem<IRepair>(endpoints.repair, data)
        : updateItem(endpoints.repair, currentRepair.repairId!, data, lang);
      const { status } = await api;
      if (status == 200) {
        toast.success(
          currentRepair ? translations['update_success'] : translations['create_success']
        );
        router.push(paths.dashboard.car.repair(car.carId!));
      }
    } catch (error) {
      throw error;
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
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
          <LocalizationProvider>
            <Field.DatePicker name="repairDate" label={translations['RepairDate']} />
          </LocalizationProvider>

          <Field.Select name="mechanicId" label={translations['MechanicName']}>
            {mechanics.map((x) => (
              <MenuItem key={x.mechanicId} value={x.mechanicId}>
                {x.mechanicName}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Select
            name="dashboardReplacerId"
            label={translations['DashboardReplacer']}
          >
            {mechanics.map((x) => (
              <MenuItem key={x.mechanicId} value={x.mechanicId}>
                {x.mechanicName}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Select
            name="steeringReplacerId"
            label={translations['SteeringReplacer']}
          >
            {mechanics.map((x) => (
              <MenuItem key={x.mechanicId} value={x.mechanicId}>
                {x.mechanicName}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Text
            name="mechanicWorkHours"
            label={translations['MechanicWorkHours']}
            type="number"
          />

          <Field.Text
            name="mechanicLaborCost"
            label={translations['MechanicLaborCost']}
            type="number"
          />

          <Field.Text
            name="mechanicTechnicalNote"
            label={translations['MechanicTechnicalNote']}
            multiline={true}
            rows={4}
            sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
          />

          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="subtitle2" color="gray">
                {tCommon('repair.parts')}:
              </Typography>
              <Button
                variant="soft"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => {
                  append({
                    carPartId: 0,
                    mechanicId: 0,
                    partCost: 0,
                    partCount: 1,
                    partId: 0,
                    // replaceDate: '',
                  });
                }}
              >
                {tCommon('baseInfo.addPart')}
              </Button>
            </Box>
          </Box>
          <Scrollbar sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  {/* <TableCell>{tCommon('date')}</TableCell> */}
                  <TableCell>{translations['PartName']}</TableCell>
                  <TableCell>{translations['PartCount']}</TableCell>
                  <TableCell>{translations['MechanicName']}</TableCell>
                  <TableCell>{translations['PartCost']}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  '& .MuiTableCell-root': {
                    p: '4px',
                  },
                }}
              >
                {repairedParts.map((x, index) => (
                  <TableRow key={x.id}>
                    {/* <TableCell sx={{ width: '170px' }}>
                      <LocalizationProvider>
                        <Field.DatePicker name={`parts.${index}.replaceDate`} />
                      </LocalizationProvider>
                    </TableCell> */}

                    <TableCell sx={{ width: '200px' }}>
                      <Field.Select
                        name={`parts.${index}.partId`}
                        onChange={(e) => {
                          const partId = Number(e.target.value);
                          const part = parts.find((x) => x.partId == partId);
                          const count =
                            methods.getValues(`parts.${index}.partCount`) || 1;
                          setValue(`parts.${index}.partId`, partId);
                          setValue(
                            `parts.${index}.partCost`,
                            part ? part.partPrice * count : 0
                          );
                        }}
                      >
                        {parts.map((p) => (
                          <MenuItem key={p.partId} value={p.partId}>
                            {p.partName}
                          </MenuItem>
                        ))}
                      </Field.Select>
                    </TableCell>

                    <TableCell sx={{ width: '100px' }}>
                      <Field.Text
                        name={`parts.${index}.partCount`}
                        type="number"
                        onChange={(e) => {
                          const count = Number(e.target.value);
                          const partId = methods.getValues(`parts.${index}.partId`);
                          const part = parts.find((x) => x.partId == partId);
                          setValue(`parts.${index}.partCount`, count);
                          setValue(
                            `parts.${index}.partCost`,
                            part ? part.partPrice * count : 0
                          );
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ width: '200px' }}>
                      <Field.Select name={`parts.${index}.mechanicId`}>
                        {mechanics.map((m) => (
                          <MenuItem key={m.mechanicId} value={m.mechanicId}>
                            {m.mechanicName}
                          </MenuItem>
                        ))}
                      </Field.Select>
                    </TableCell>

                    <TableCell sx={{ width: '150px' }}>
                      <Field.Text
                        name={`parts.${index}.partCost`}
                        type="number"
                        disabled
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Box
                                  sx={{ typography: 'subtitle2', color: 'text.disabled' }}
                                >
                                  ¥
                                </Box>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ width: '40px' }}>
                      <IconButton color="error" onClick={() => remove(index)}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>
        <Stack sx={{ mt: 3, alignItems: 'end' }}>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            {!currentRepair
              ? `${tCommon('create')} ${tCommon('repair.repair')}`
              : tCommon('save')}
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}
