import { latoFont } from '@/helpers/fonts';
import { Metadata } from 'next';
import React from 'react';
import '@/assets/styles/globals.css';

export const metadata: Metadata = {
  title: 'Login',
};

export default function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <body className={`${latoFont.variable} font-lato`}>{children}</body>
    </html>
  );
}
