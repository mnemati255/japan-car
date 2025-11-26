'use client';

import messages from '@/lib/messages';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useSWR from 'swr';
import userService from '@/lib/services/user-service';
import Loading from '@/components/layout/Loading';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import roleService from '@/lib/services/role-service';

export default function RolePage() {
  // Varialbes
  const router = useRouter();
  const params = useParams();
  const isEdit = params.id && +params.id > 0;
  console.log(params.id);
  const schema = z.object({
    userName: z.string().min(1, { error: messages.required() }),
    password: isEdit
      ? z.string().min(0)
      : z
          .string()
          .min(1, { error: messages.required() })
          .length(6, { error: messages.minLength(6) }),
    email: z.email().nullable().optional(),
    roleIds: z.array(z.number()).min(1, { error: messages.requiredAtLeast() }),
    isActive: z.boolean(),
  });

  // Get data
  const fetchAll = async () => {
    const roles = await roleService.getRoles();
    const user =
      params.id && +params.id > 0 ? await userService.getUserById(+params.id) : null;
    return [roles, user] as const;
  };
  const { data, isLoading, error } = useSWR(
    params.id ? `data-${params.id}` : 'data-add',
    fetchAll
  );
  const roles = data?.[0];
  const user = data?.[1];

  // Define form
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      userName: '',
      password: '',
      email: null,
      roleIds: [],
      isActive: true,
    },
  });

  // Initial form
  useEffect(() => {
    if (user) {
      form.reset({
        userName: user.userName,
        password: '',
        email: user.email,
        roleIds: user.roleIds,
        isActive: user.isActive,
      });
    }
  }, [user, form]);

  // Functions
  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      if (params.id && +params.id === 0) {
        const { status } = await userService.createUser(values);
        if (status === 200) {
          router.back();
        }
      } else {
        const { status } = await userService.updateUser(+params.id!, values);
        if (status === 200) {
          router.back();
        }
      }
    } catch (error) {
      throw error;
    }
  }

  // UI
  if (error) {
    console.log(error);
    return <div>ERROR</div>;
  }

  if (isLoading) return <Loading />;

  return (
    <div className="grid md:grid-cols-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="userName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>User name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-4">
                  <FormLabel>Is active?</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          ></FormField>

          <FormField
            name="roleIds"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <p>Roles:</p>
                <div className="space-y-3 mt-4">
                  {roles?.map((item) => {
                    const isChecked = (field.value || []).includes(item.roleId!);
                    return (
                      <div key={item.roleId} className="flex items-center gap-3">
                        <Checkbox
                          id={`${item.roleId}`}
                          value={item.roleId}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, item.roleId]);
                            } else {
                              field.onChange(
                                field.value.filter((v: number) => v !== item.roleId)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={`${item.roleId}`}>{item.roleName}</Label>
                      </div>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Button type="submit" className="mt-12">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
