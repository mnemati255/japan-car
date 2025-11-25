import { latoFont } from '@/helpers/fonts';
import { Metadata } from 'next';
import React from 'react';
import '@/assets/styles/globals.css';
import GlobalToast from '@/components/layout/GlobalToast';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: 'Login',
};

export default function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <body className={`${latoFont.variable} font-lato`}>
        {children}
        <ToastContainer
          theme="colored"
          closeOnClick={true}
          toastClassName={`text-[14px] ${latoFont.className}`}
        />
        <GlobalToast />
      </body>
    </html>
  );
}
