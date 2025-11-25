import axios, { AxiosError, type AxiosInstance } from 'axios';
// import { useToastStore } from '@/stores/toastStore';
// import { useLoadingStore } from '@/stores/loadingStore';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    let showLoading = true;
    const notLoading: string[] = [];
    for (let i = 0; i < notLoading.length; i++) {
      if (String(config.url).includes(notLoading[i])) {
        showLoading = false;
        break;
      }
    }

    // useLoadingStore.getState().setLoading(true);
    return config;
  },
  () => {
    // useLoadingStore.getState().setLoading(false);
    // useToastStore.getState().setToast('error', 'ارتباط با سرور با خطا مواجه شد.');
  }
);

apiClient.interceptors.response.use(
  (config) => {
    // useLoadingStore.getState().setLoading(false);
    const res = config.data;
    if (res.message) {
      //   useToastStore.getState().setToast(res.messageType, res.message);
    }
    return config;
  },
  (error: AxiosError) => {
    // useLoadingStore.getState().setLoading(false);
    const status = error.response?.status;
    if (status === 403) {
      //   useToastStore.getState().setToast('error', 'دسترسی غیر مجاز');
    } else if (status === 401) {
      //   useToastStore.getState().setToast('error', 'دسترسی غیر مجاز');
    } else {
      const { response } = error;
      if (response) {
        if (response.data) {
          //   let dt = response.data;
          //   const { Message, message } = Array.isArray(dt) ? dt[0] : dt;
          //   useToastStore.getState().setToast('error', Message || message);
        } else {
          //   useToastStore
          // .getState()
          // .setToast('error', 'دریافت پاسخ از سرور با خطا مواجه شد.');
        }
      } else {
        // useToastStore.getState().setToast('error', 'خطای ناشناخته');
      }
    }
  }
);

export default apiClient;
