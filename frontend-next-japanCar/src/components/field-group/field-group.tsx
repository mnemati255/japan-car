import Box, { BoxProps } from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

type Props = BoxProps & {
  title: string;
};

export function FieldGroup({ title, ...other }: Props) {
  return (
    <Box {...other}>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Chip label={title} sx={{ width: '180px' }} />
        <Divider sx={{ flexGrow: 1 }} />
      </Box>
    </Box>
  );
}
