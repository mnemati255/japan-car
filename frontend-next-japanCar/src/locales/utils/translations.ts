import { FieldNameType, ITranslation } from '@/types/translation';
import { LangCode } from '../locales-config';

const KEY = 'translations';

export function setTranslations(values: ITranslation[]) {
  localStorage.setItem(KEY, JSON.stringify(values));
}

function getTranslations(): ITranslation[] {
  const translations = localStorage.getItem(KEY);
  if (!translations) return [];
  return JSON.parse(translations) as ITranslation[];
}

export function getFormFields(locale: LangCode): Record<FieldNameType, string> {
  const translations = getTranslations().filter(
    (x) => x.category === 'FormField' && x.languageCode == locale
  );

  const result: Record<FieldNameType, string> = {} as Record<FieldNameType, string>;

  translations.forEach((x) => {
    result[x.fieldName] = x.translatedValue || x.fieldName;
  });

  return result;
}

export function getSystemMessages(locale: LangCode) {
  const translations = getTranslations().filter(
    (x) => x.category === 'SystemMessage' && x.languageCode == locale
  );
  return translations.map((x) => ({
    fieldName: x.fieldName,
    translatedValue: x.translatedValue,
  }));
}
