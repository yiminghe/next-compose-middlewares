import ICU from 'i18next-icu';
import { i18n, createInstance } from 'i18next';
import { getI18nComponent } from './types';

type R = {
  i18n: i18n;
  translation: any;
  c: ReturnType<typeof getI18nComponent>;
};
const cache = new Map<string, R>();

export function getI18nInstance(
  locale: 'zh-CN' | 'en-US',
  translation: any,
): R {
  let instance = cache.get(locale);
  if (!instance) {
    const i18n = createInstance();
    i18n.use(ICU).init({
      lng: locale,
      interpolation: {
        escapeValue: false,
      },
      resources: {
        [locale]: { translation },
      },
    });
    instance = { i18n, translation, c: getI18nComponent(i18n) };
    cache.set(locale, instance);
  }
  return instance;
}
