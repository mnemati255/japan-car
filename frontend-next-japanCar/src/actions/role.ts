import type { IPermissionItem, IRoleItem } from '@/types/role';
import useSWR, { mutate } from 'swr';
import axiosInstance, { fetcher } from '@/lib/axios';
import { CONFIG, swrOptions } from '@/global-config';

// ----------------------------------------------------------------------

const BASE_URL = `${CONFIG.serverUrl}/role`;

// ----------------------------------------------------------------------

export function useGetPermissions() {
  const url = `${BASE_URL}/permissions`;
  const { data, isLoading, error, isValidating } = useSWR<IPermissionItem[]>(
    url,
    fetcher,
    {
      ...swrOptions,
    }
  );

  return {
    permissions: data || [],
    permissionsLoading: isLoading,
    permissionsError: error,
    permissionsValidating: isValidating,
    permissionsEmpty: !isLoading && !data?.length,
  };
}

// ----------------------------------------------------------------------

export function useGetRoles() {
  const url = BASE_URL;
  const { data, isLoading, error, isValidating } = useSWR<IRoleItem[]>(url, fetcher, {
    ...swrOptions,
  });

  return {
    roles: data || [],
    rolesLoading: isLoading,
    rolesError: error,
    rolesValidating: isValidating,
    rolesEmpty: !isLoading && !data?.length,
  };
}

// ----------------------------------------------------------------------

export async function getRoleById(id: number) {
  const res = await axiosInstance.get(`${BASE_URL}/${id}`);
  return res;
}

// ----------------------------------------------------------------------

export async function createRole(rowData: IRoleItem) {
  const url = BASE_URL;
  const response = await axiosInstance.post(url, rowData);
  if (response && response.status == 200) {
    mutate(BASE_URL, () => {});
  }

  return response;
}

// ----------------------------------------------------------------------

export async function updateRole(roleId: number, rowData: IRoleItem) {
  const url = `${BASE_URL}/${roleId}`;
  const response = await axiosInstance.put(url, rowData);
  if (response && response.status == 200) {
    mutate(BASE_URL, () => {});
  }

  return response;
}

// ----------------------------------------------------------------------

export async function deleteRole(roleId: number) {
  const url = `${BASE_URL}/${roleId}`;
  const response = await axiosInstance.delete(url);
  if (response && response.status === 200) {
    mutate(BASE_URL, () => {});
  }
}
