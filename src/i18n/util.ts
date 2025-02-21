import { I18nTranslate } from './types';

import IntlMessageFormat from 'intl-messageformat';
import { memoize } from '@formatjs/fast-memoize';
const formatters = {
  formatters: {
    getNumberFormat: memoize(
      (locale, opts) => new Intl.NumberFormat(locale, opts),
    ),
    getDateTimeFormat: memoize(
      (locale, opts) => new Intl.DateTimeFormat(locale, opts),
    ),
    getPluralRules: memoize(
      (locale, opts) => new Intl.PluralRules(locale, opts),
    ),
  },
};

const cache = new Map<string, Map<string, IntlMessageFormat>>();

type R = { t: I18nTranslate; messages: any };

const instanceMap = new Map<any, R>();

export function getI18nInstance(
  locale: 'zh-CN' | 'en-US',
  messages: any,
  cacheKey?: any,
): R {
  cacheKey = cacheKey || messages;
  let instance: any = instanceMap.get(cacheKey);
  if (!instance) {
    let formatterCache = cache.get(locale);
    if (!formatterCache) {
      formatterCache = new Map<string, IntlMessageFormat>();
      cache.set(locale, formatterCache);
    }
    instance = {
      messages,
      t(key: any, values: any) {
        let formatter = formatterCache.get(key);
        if (!formatter) {
          formatter = new IntlMessageFormat(
            messages[key],
            locale,
            undefined,
            formatters,
          );
          formatterCache.set(key, formatter);
        }
        return formatter.format(values);
      },
    } as any;
    instanceMap.set(cacheKey, instance);
  }

  return instance;
}
