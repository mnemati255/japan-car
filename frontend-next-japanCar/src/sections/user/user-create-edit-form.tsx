import type { IUserItem } from '@/types/user';

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
import messages from '@/lib/messages';
import { useGetRoles } from '@/actions/role';
import { createUser, updateUsere as updateUser } from '@/actions/user';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

export function UserCreateEditForm({ currentUser }: Props) {

  const router = useRouter();

  const UserCreateSchema = z.object({
    userName: z.string().min(1, { error: messages.required() }),
    password: !currentUser
      ? z
          .string()
          .min(1, { error: messages.required() })
          .min(6, { error: messages.minLength(6) })
      : z
          .string()
          .trim()
          .optional()
          .transform((val) => (val === '' ? undefined : val))
          .refine((val) => !val || val.length >= 6, { message: messages.minLength(6) }),
    email: z
      .string()
      .trim()
      .optional()
      .nullable()
      .transform((val) => (val === '' ? undefined : val))
      .pipe(z.email({ error: messages.invalid }).optional()),
    roleIds: z.array(z.coerce.number()).min(1, { error: messages.requiredAtLeast() }),
    isActive: z.boolean(),
  });

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(UserCreateSchema),
    defaultValues: {
      email: currentUser?.email ?? '',
      isActive: currentUser?.isActive ?? true,
      password: '',
      roleIds: currentUser?.roleIds.map((x) => String(x)) ?? [],
      userName: currentUser?.userName ?? '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { roles } = useGetRoles();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!currentUser) await createUser(data);
      else await updateUser(currentUser.userId!, data);
      toast.success(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.root);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
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
              <Field.Text
                name="userName"
                label="User name"
                disabled={currentUser != null}
              />
              <Field.Text name="password" label="Password" type="password" />
              <Field.Text name="email" label="Email address" />

              <Stack sx={{ gridColumnStart: 1 }} direction={'row'} alignItems={'center'}>
                <Typography variant="subtitle2" color="gray">
                  Is user active?
                </Typography>
                <Field.Switch name="isActive" label="" />
              </Stack>

              <Stack spacing={1} sx={{ gridColumnStart: 1 }}>
                <Typography variant="subtitle2" color="gray">
                  Roles:
                </Typography>
                <Field.MultiCheckbox
                  row
                  name="roleIds"
                  options={roles.map((x) => ({
                    label: x.roleName,
                    value: x.roleId!.toString(),
                  }))}
                  sx={{ gap: 4 }}
                />
              </Stack>
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Create user' : 'Save changes'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
