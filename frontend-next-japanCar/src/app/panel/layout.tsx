import { Metadata } from 'next';
import React from 'react';
import '@/assets/styles/globals.css';
import AppSidebar from '@/components/layout/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: 'Admin Panel',
};

export default function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full'>
        <SidebarTrigger />
        <div className='p-6'>
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
