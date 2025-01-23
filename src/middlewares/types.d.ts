import { getI18nComponent, I18nTranslate } from '@/i18n/types';
import type { NextContext } from '@/next-compose-middlewares';
declare module '@/next-compose-middlewares' {
  interface NextContext {
    user?: string;
    translation?: any;
    locale?: 'zh-CN' | 'en-US';
    t?: I18nTranslate;
    T?: ReturnType<typeof getI18nComponent>;
    extraContent?: {
      from: string;
    };
  }
}
