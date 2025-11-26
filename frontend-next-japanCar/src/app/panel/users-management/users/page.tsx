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
import { IUser } from '@/lib/interfaces/user';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  // Get users
  const {
    data: users,
    isLoading,
    error,
  } = useSWR('users', () => userService.getUsers(), { errorRetryCount: 3 });

  // Variables
  const [id, setId] = useState(0);
  const [dialog_delete, setDialog_delete] = useState(false);
  const router = useRouter();

  // Functions
  const handleDeleteClick = useCallback((roleId: number) => {
    setId(roleId);
    setDialog_delete(true);
  }, []);

  const deleteUser = useCallback(async () => {
    try {
      const { status } = await userService.deleteUser(id);
      if (status == 200) {
        mutate(
          'users',
          users?.filter((x) => x.userId !== id),
          false
        );
        setDialog_delete(false);
      }
    } catch (error) {
      throw error;
    }
  }, [id, users]);

  // UI
  if (error) return <div>ERROR</div>;

  if (isLoading) return <Loading />;

  const columns = [
    { header: 'User Name', accessor: 'userName', width: '200px' },
    { header: 'Email', accessor: 'email', width: '200px' },
    {
      header: 'Status',
      accessor: (row: IUser) => {
        if (row.isActive) return 'active';
        return 'inactive';
      },
      width: '200px',
    },
  ];
  const actions = [
    {
      icon: <Edit color="orange" />,
      label: 'Edit',
      onClick: (row: IUser) => router.push(`./users/${row.userId}`),
    },
    {
      icon: <Trash color="red" />,
      label: 'Delete',
      onClick: (row: IUser) => handleDeleteClick(row.userId!),
    },
  ];

  return (
    <div>
      <Link href={`./users/0`}>
        <Button variant={'outline'}>
          <Plus />
          Create user
        </Button>
      </Link>

      <MTable<IUser> data={users} columns={columns} actions={actions} className="mt-8" />

      <MQuestion
        open={dialog_delete}
        onClose={() => setDialog_delete(false)}
        onYes={deleteUser}
      />
    </div>
  );
}
