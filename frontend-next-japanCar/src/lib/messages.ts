'use client';

import { useTranslateFromServer } from '@/locales';

export function useMessage() {
  const { translations } = useTranslateFromServer();

  const messages = {
    required: () => translations['mes_required'],
    requiredAtLeast: () => translations['mes_requiredAtLeast'],
    invalid: () => translations['mes_invalid'],
    minLength6: () => translations['mes_minLength6'],
    minCount3: () => translations['mes_minCount3'],
    selectType: () => translations['mes_selectImageType'],
    duplicate: () => 'Duplicate image file names are not allowed.',
  };

  return { messages };
}
