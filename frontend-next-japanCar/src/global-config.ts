// import { paths } from '@/routes/paths';

import { SWRConfiguration } from 'swr';
import packageJson from '../package.json';
import { paths } from './routes/paths';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  serverUrl: string;
  assetsDir: string;
  carsImagesDir: string;
  isStaticExport: boolean;
  auth: {
    method: 'jwt';
    skip: boolean;
    redirectPath: string;
  };
  appSettings: {
    pageSize: number;
  };
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'Minimal UI',
  appVersion: packageJson.version,
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? '',
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? '',
  carsImagesDir: process.env.NEXT_PUBLIC_CARS_IMAGES_DIR ?? '',
  isStaticExport: JSON.parse(process.env.BUILD_STATIC_EXPORT ?? 'false'),
  /**
   * Auth
   * @method jwt | amplify | firebase | supabase | auth0
   */
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: paths.dashboard.auction.root,
  },
  appSettings: {
    pageSize: Number(process.env.NEXT_PUBLIC_PAGE_SIZE) ?? 10,
  },
};

// ----------------------------------------------------------------------

export const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};
