import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from '@/routes/paths';
import { useRouter } from '@/routes/hooks';
import { toast } from '@/components/snackbar';
import { Form, Field } from '@/components/hook-form';
import { IRoleItem } from '@/types/role';
import { createRole, updateRole, useGetPermissions } from '@/actions/role';
import Typography from '@mui/material/Typography';
import messages from '@/lib/messages';

// ----------------------------------------------------------------------

export type RoleCreateSchemaType = z.infer<typeof RoleCreateSchema>;

export const RoleCreateSchema = z.object({
  roleName: z.string().min(1, { error: messages.required() }),
  description: z.string().nullable().optional(),
  permissionIds: z.array(z.coerce.number()).min(1, { error: messages.requiredAtLeast() }),
  // email: schemaUtils.email(),
});

// ----------------------------------------------------------------------

type Props = {
  currentRole?: IRoleItem;
};

export function RoleCreateEditForm({ currentRole }: Props) {
  const router = useRouter();

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(RoleCreateSchema),
    defaultValues: {
      roleName: currentRole?.roleName ?? '',
      description: currentRole?.description ?? '',
      permissionIds: currentRole?.permissionIds.map((x) => String(x)) ?? [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { permissions } = useGetPermissions();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!currentRole) await createRole(data);
      else await updateRole(currentRole.roleId!, data);
      toast.success(currentRole ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.role.root);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid size={{ xs: 12, md: 12 }}>
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Text name="roleName" label="Role name" />
            <Field.Text name="description" label="Description" />

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="gray">
                Permissions:
              </Typography>
              <Field.MultiCheckbox
                row
                name="permissionIds"
                options={permissions.map((x) => ({
                  label: x.permissionName,
                  value: x.permissionId.toString(),
                }))}
                sx={{ gap: 4 }}
              />
            </Stack>
          </Box>

          <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              {!currentRole ? 'Create role' : 'Save changes'}
            </Button>
          </Stack>
        </Card>
      </Grid>
    </Form>
  );
}
