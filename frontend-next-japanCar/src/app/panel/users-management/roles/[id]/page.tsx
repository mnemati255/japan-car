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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import useSWR from 'swr';
import userService from '@/lib/services/user-service';
import Loading from '@/components/layout/Loading';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const schema = z.object({
  roleName: z.string().min(1, { error: messages.required() }),
  description: z.string().nullable().optional(),
  permissionIds: z.array(z.number()).min(1, { error: messages.requiredAtLeast() }),
});

export default function Role() {
  // Varialbes
  const router = useRouter();
  const params = useParams();

  // Get data
  const fetchAll = async () => {
    const permissions = await userService.getPermissions();
    const role =
      params.id && +params.id > 0 ? await userService.getRoleById(+params.id) : null;
    return [permissions, role] as const;
  };
  const { data, isLoading, error } = useSWR('data', fetchAll);
  const permissions = data?.[0];
  const role = data?.[1];

  // Define form
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      roleName: role ? role.roleName : '',
      description: role ? role.description : null,
      permissionIds: [],
    },
  });

  // Initial form
  useEffect(() => {
    if (role) {
      form.reset({
        roleName: role.roleName,
        description: role.description,
        permissionIds: role.permissionIds,
      });
    }
  }, [role, form]);

  // Functions
  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      if (params.id && +params.id === 0) {
        const { status } = await userService.createRole(values);
        if (status === 200) {
          router.back();
        }
      } else {
        const { status } = await userService.updateRole(+params.id!, values);
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
            name="roleName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ''} />
                </FormControl>
              </FormItem>
            )}
          ></FormField>

          <FormField
            name="permissionIds"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <p>Permissions:</p>
                <div className="space-y-3 mt-4">
                  {permissions?.map((item) => {
                    const isChecked = (field.value || []).includes(item.permissionId);
                    return (
                      <div key={item.permissionId} className="flex items-center gap-3">
                        <Checkbox
                          id={`${item.permissionId}`}
                          value={item.permissionId}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, item.permissionId]);
                            } else {
                              field.onChange(
                                field.value.filter((v: number) => v !== item.permissionId)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={`${item.permissionId}`}>
                          {item.permissionName}
                        </Label>
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
