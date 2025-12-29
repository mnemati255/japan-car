import type { AxiosError, AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from '@/global-config';
import { useToastStore } from '@/stores/toastStore';
import { JWT_STORAGE_KEY } from '@/auth/context/jwt';

// ----------------------------------------------------------------------

export const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  withCredentials: true,
});

/**
 * Optional: Add token (if using auth)
 *
 axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
*
*/

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(JWT_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const locale = sessionStorage.getItem('locale');
  config.headers['X-Locale'] = locale ?? 'en';
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // useLoadingStore.getState().setLoading(false);
    const status = error.response?.status;
    if (status === 403) {
      useToastStore.getState().setToast('error', 'Access denied.');
    } else if (status === 401) {
      useToastStore.getState().setToast('error', 'Access denied.');
    } else {
      const { response } = error;
      if (response) {
        if (response.data) {
          const dt: any = response.data;
          if (Array.isArray(dt)) {
            useToastStore.getState().setToast('error', dt.join('\n'));
          } else {
            const { Message, message } = dt;
            useToastStore.getState().setToast('error', Message || message);
          }
        } else {
          useToastStore
            .getState()
            .setToast('error', 'Failed to receive a response from the server.');
        }
      } else {
        useToastStore.getState().setToast('error', 'Unknown error');
      }
    }
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async <T = unknown>(
  args: string | [string, AxiosRequestConfig]
): Promise<T> => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];
    const res = await axiosInstance.get<T>(url, config);
    return res.data;
  } catch (error) {
    console.error('Fetcher failed:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/auth/me',
    signIn: '/auth/login',
    signUp: '/api/auth/sign-up',
  },
  notification: 'notification',
  car: 'car',
  repair: 'repair',
  customer: 'customer',
  user: 'user',
  baseInfo: {
    auction: 'auction',
    brand: 'baseInfo/brand',
    color: 'baseInfo/color',
    model: 'baseInfo/model',
    part: 'part',
    mechanic: 'mechanic',
  },
} as const;
