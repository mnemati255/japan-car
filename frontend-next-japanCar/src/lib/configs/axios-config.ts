import axios, { AxiosError, type AxiosInstance } from 'axios';
import { useToastStore } from '@/stores/toastStore';
// import { useLoadingStore } from '@/stores/loadingStore';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    // let showLoading = true;
    // const notLoading: string[] = [];
    // for (let i = 0; i < notLoading.length; i++) {
    //   if (String(config.url).includes(notLoading[i])) {
    //     showLoading = false;
    //     break;
    //   }
    // }

    // useLoadingStore.getState().setLoading(true);
    return config;
  },
  () => {
    // useLoadingStore.getState().setLoading(false);
    useToastStore.getState().setToast('error', 'Connection to the server failed.');
  }
);

apiClient.interceptors.response.use(
  (config) => {
    // useLoadingStore.getState().setLoading(false);
    const res = config.data;
    if (res.message) {
      useToastStore.getState().setToast(res.messageType, res.message);
    }
    return config;
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dt: any = response.data;
          console.log(22, dt);
          const { Message, message } = Array.isArray(dt) ? dt[0] : dt;
          useToastStore.getState().setToast('error', Message || message);
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

export default apiClient;
