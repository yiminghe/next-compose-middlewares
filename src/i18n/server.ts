import zh from './zh-CN.json';
import en from './en-US.json';
import { getI18nInstance } from './util';

export function getI18n(locale: 'zh-CN' | 'en-US') {
  return getI18nInstance(locale, locale === 'zh-CN' ? zh : en);
}
