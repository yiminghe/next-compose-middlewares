'use client';
import { createContext, use } from 'react';
import { getI18nComponent, I18nTranslate } from './types';
import { getI18nInstance } from './util';

const I18nContext = createContext<{
  t: I18nTranslate;
  c: ReturnType<typeof getI18nComponent>;
}>(null as any);

export function getI18nContext() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return use(I18nContext);
}

export function I18nProvider({
  children,
  locale,
  translation,
}: {
  children: any;
  locale: 'zh-CN' | 'en-US';
  translation: any;
}) {
  const { i18n, c } = getI18nInstance(locale, translation);
  const t = i18n.t as I18nTranslate;
  return <I18nContext value={{ t, c }}>{children}</I18nContext>;
}
