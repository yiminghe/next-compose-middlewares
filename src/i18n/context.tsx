'use client';
import { createContext, use } from 'react';
import { I18nTranslate } from './types';
import { getI18nInstance } from './util';

const I18nContext = createContext<{
  t: I18nTranslate;
}>(null as any);

export function getI18nContext() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return use(I18nContext);
}

export function I18nProvider({
  children,
  locale,
  messages,
}: {
  children: any;
  locale: 'zh-CN' | 'en-US';
  messages: any;
}) {
  const { t } = getI18nInstance(locale, messages);
  return <I18nContext value={{ t }}>{children}</I18nContext>;
}
