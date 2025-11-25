/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Loading from '@/components/layout/Loading';
import { Button } from '@/components/ui/button';
import userService from '@/lib/services/user-service';
import { Edit, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import useSWR, { mutate } from 'swr';
import MQuestion from '@/components/shared/MQuestion';
import { useCallback, useState } from 'react';
import { MTable } from '@/components/shared/MTable';
import { IRole } from '@/lib/interfaces/role';

export default function Roles() {
  // Get roles
  const {
    data: roles,
    isLoading,
    error,
  } = useSWR('roles', () => userService.getRoles(), { errorRetryCount: 3 });

  // Variables
  const [id, setId] = useState(0);
  const [dialog_delete, setDialog_delete] = useState(false);

  // Functions
  const handleDeleteClick = useCallback((roleId: number) => {
    setId(roleId);
    setDialog_delete(true);
  }, []);

  const deleteRole = useCallback(async () => {
    try {
      const { status } = await userService.deleteRole(id);
      if (status == 200) {
        mutate(
          'roles',
          roles?.filter((x) => x.roleId !== id),
          false
        );
        setDialog_delete(false);
      }
    } catch (error) {
      throw error;
    }
  }, [id, roles]);

  // UI
  if (error) return <div>ERROR</div>;

  if (isLoading) return <Loading />;

  const columns = [{ header: 'Role Name', accessor: 'roleName', width: '200px' }];
  const actions = [
    {
      icon: <Edit color="orange" />,
      label: 'Edit',
      onClick: (row: any) => window.location.assign(`./roles/${row.roleId}`),
    },
    {
      icon: <Trash color="red" />,
      label: 'Delete',
      onClick: (row: any) => handleDeleteClick(row.roleId),
    },
  ];

  return (
    <div>
      <Link href={`./roles/0`}>
        <Button variant={'outline'}>
          <Plus />
          Add role
        </Button>
      </Link>

      <MTable<IRole> data={roles} columns={columns} actions={actions} className="mt-12" />

      <MQuestion
        open={dialog_delete}
        onClose={() => setDialog_delete(false)}
        onYes={deleteRole}
      />
    </div>
  );
}
