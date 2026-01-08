import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

export type RHFTextFieldProps = TextFieldProps & {
  name: string;
  thousandSeparator?: boolean;
};

const formatNumber = (value: string | number) => {
  if (value === null || value === undefined || value === '') return '';
  const num = value.toString().replace(/,/g, '');
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const unformatNumber = (value: string) => value.replace(/,/g, '');

export function RHFTextField({
  name,
  helperText,
  slotProps,
  type = 'text',
  thousandSeparator = false,
  ...other
}: RHFTextFieldProps) {
  const { control } = useFormContext();
  const isNumberType = type === 'number';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          id={name}
          fullWidth
          type={isNumberType && thousandSeparator ? 'text' : type}
          value={
            isNumberType && thousandSeparator
              ? formatNumber(field.value)
              : field.value ?? ''
          }
          onChange={(event) => {
            let value = event.target.value;

            if (isNumberType && thousandSeparator) {
              value = unformatNumber(value);
            }

            field.onChange(value);
          }}
          error={!!error}
          helperText={error?.message ?? helperText}
          slotProps={{
            ...slotProps,
            htmlInput: {
              ...slotProps?.htmlInput,
              autoComplete: 'off',
              ...(isNumberType && {
                inputMode: 'decimal',
                pattern: '[0-9,]*',
              }),
            },
          }}
          {...other}
        />
      )}
    />
  );
}
