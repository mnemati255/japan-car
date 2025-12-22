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
import { useTranslate, useTranslateFromServer } from '@/locales';

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
  const { t: tCommon } = useTranslate('common');
  const { translations } = useTranslateFromServer();

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
      const api = !currentRole ? createRole(data) : updateRole(currentRole.roleId!, data);
      const { status } = await api;
      if (status == 200) {
        toast.success(
          currentRole
            ? translations['update_success']
            : translations['create_success']
        );
        router.push(paths.dashboard.role.root);
      }
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
            <Field.Text name="roleName" label={translations['RoleName']} />
            <Field.Text name="description" label={translations['Description']} />

            <Stack spacing={1} sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <Typography variant="subtitle2" color="gray">
                {tCommon('role.permissions')}:
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
              {!currentRole
                ? `${tCommon('create')} ${tCommon('role.role')}`
                : tCommon('save')}
            </Button>
          </Stack>
        </Card>
      </Grid>
    </Form>
  );
}
