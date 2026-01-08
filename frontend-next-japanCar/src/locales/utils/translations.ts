import { CategoryType, FieldNameType, ITranslation } from '@/types/translation';
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

export function getTranslations(
  locale: LangCode,
  category?: CategoryType
): Record<FieldNameType, string> {
  let translations = (getTranslationsFromLocalStorage() || []).filter(
    (x) => x.languageCode === locale
  );
  if (category) {
    translations = translations.filter((x) => x.category === category);
  } else {
    translations = translations.filter((x) => x.category !== 'Notification');
  }

  const result: Record<FieldNameType, string> = {} as Record<FieldNameType, string>;

  translations.forEach((x) => {
    result[x.fieldName] = x.translatedValue || x.fieldName;
  });

  return result;
}
