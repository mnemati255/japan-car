'use client';

import { DictType } from '@/types/DictType';
import { LangType } from '@/types/LangType';
import React, { createContext, useContext } from 'react';

interface LangContextType {
  dict: DictType;
  lang: LangType;
}

// تعریف نوع Context
const LangContext = createContext<LangContextType | undefined>(undefined);

// هوک برای استفاده از Context
export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
};

// Provider برای مدیریت Context
export const LangContextProvider: React.FC<{
  dict: DictType;
  lang: LangType;
  children: React.ReactNode;
}> = ({ dict, lang, children }) => {
  return <LangContext.Provider value={{ dict, lang }}>{children}</LangContext.Provider>;
};
