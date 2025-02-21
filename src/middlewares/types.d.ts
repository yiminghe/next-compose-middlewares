import { I18nTranslate } from '@/i18n/types';
import type { NextContext } from '@/next-context';
declare module '@/next-context' {
  interface NextContext {
    user?: string;
    messages?: any;
    locale?: 'zh-CN' | 'en-US';
    t?: I18nTranslate;

    extraContent?: {
      from: string;
    };
  }
}
