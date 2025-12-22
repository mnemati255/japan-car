'use client';

import type { IUserItem } from '@/types/user';
import { paths } from '@/routes/paths';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { UserCreateEditForm } from '../user-create-edit-form';
import { useEffect, useState } from 'react';
import { getUserById } from '@/actions/user';
import { useTranslate } from '@/locales';

// ----------------------------------------------------------------------

type Props = {
  userId?: number;
};

export function UserEditView({ userId }: Props) {
  const [currentUser, setCurrentUser] = useState<IUserItem>();
  const { t: tCommon } = useTranslate('common');

  useEffect(() => {
    if (userId) {
      const getUser = async () => {
        const { status, data } = await getUserById(userId);
        if (status === 200) {
          setCurrentUser(data);
        }
      };
      getUser();
    }
  }, [userId]);

  if (!currentUser) return null;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tCommon('edit')}
        backHref={paths.dashboard.user.root}
        links={[
          { name: tCommon('dashboard'), href: paths.dashboard.root },
          { name: tCommon('user.user'), href: paths.dashboard.user.root },
          { name: currentUser?.userName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserCreateEditForm currentUser={currentUser} />
    </DashboardContent>
  );
}
