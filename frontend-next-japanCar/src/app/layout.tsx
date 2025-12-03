import '@/global.css';

import type { Metadata, Viewport } from 'next';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { CONFIG } from '@/global-config';
import { LocalizationProvider } from '@/locales';
import { detectLanguage } from '@/locales/server';
import { I18nProvider } from '@/locales/i18n-provider';
import { themeConfig, ThemeProvider, primary as primaryColor } from '@/theme';

import { Snackbar } from '@/components/snackbar';
import { ProgressBar } from '@/components/progress-bar';
import { MotionLazy } from '@/components/animate/motion-lazy';
import { detectSettings } from '@/components/settings/server';
import { SettingsDrawer, defaultSettings, SettingsProvider } from '@/components/settings';

// import { CheckoutProvider } from '@/sections/checkout/context';

import { AuthProvider as JwtAuthProvider } from '@/auth/context/jwt';
import { ToastContainer } from 'react-toastify';
import GlobalToast from '@/components/toast/global-toast';

// ----------------------------------------------------------------------

const AuthProvider = JwtAuthProvider;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primaryColor.main,
};

export const metadata: Metadata = {
  icons: [
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

// ----------------------------------------------------------------------

type RootLayoutProps = {
  children: React.ReactNode;
};

async function getAppConfig() {
  if (CONFIG.isStaticExport) {
    return {
      lang: 'en',
      i18nLang: undefined,
      cookieSettings: undefined,
      dir: defaultSettings.direction,
    };
  } else {
    const [lang, settings] = await Promise.all([detectLanguage(), detectSettings()]);

    return {
      lang,
      i18nLang: lang,
      cookieSettings: settings,
      dir: settings.direction,
    };
  }
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const appConfig = await getAppConfig();

  return (
    <html lang={appConfig.lang} dir={appConfig.dir} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          modeStorageKey={themeConfig.modeStorageKey}
          attribute={themeConfig.cssVariables.colorSchemeSelector}
          defaultMode={themeConfig.defaultMode}
        />

        <I18nProvider lang={appConfig.i18nLang}>
          <AuthProvider>
            <SettingsProvider
              defaultSettings={defaultSettings}
              cookieSettings={appConfig.cookieSettings}
            >
              <LocalizationProvider>
                <AppRouterCacheProvider options={{ key: 'css' }}>
                  <ThemeProvider
                    modeStorageKey={themeConfig.modeStorageKey}
                    defaultMode={themeConfig.defaultMode}
                  >
                    <MotionLazy>
                      <Snackbar />
                      <ProgressBar />
                      <SettingsDrawer defaultSettings={defaultSettings} />
                      {children}
                      {/* <CheckoutProvider>
                      </CheckoutProvider> */}
                    </MotionLazy>
                  </ThemeProvider>
                </AppRouterCacheProvider>
              </LocalizationProvider>
            </SettingsProvider>
          </AuthProvider>
        </I18nProvider>
        <ToastContainer theme="colored" closeOnClick={true} />
        <GlobalToast />
      </body>
    </html>
  );
}
