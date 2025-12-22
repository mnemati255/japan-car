import { FieldNameType, ITranslation } from '@/types/translation';
import { LangCode } from '../locales-config';

const KEY = 'translations';

export function setTranslations(values: ITranslation[]) {
  localStorage.setItem(KEY, JSON.stringify(values));
}

function getTranslationsFromLocalStorage(): ITranslation[] {
  const translations = localStorage.getItem(KEY);
  if (!translations) return [];
  return JSON.parse(translations) as ITranslation[];
}

export function getTranslations(locale: LangCode): Record<FieldNameType, string> {
  const translations = getTranslationsFromLocalStorage().filter(
    (x) => x.languageCode == locale
  );

  const result: Record<FieldNameType, string> = {} as Record<FieldNameType, string>;

  translations.forEach((x) => {
    result[x.fieldName] = x.translatedValue || x.fieldName;
  });

  return result;
}
