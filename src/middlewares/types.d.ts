import { I18nTranslate } from '@/i18n/types';
import type { NextContext } from 'next-context';

declare module 'next-context' {
  interface I18nContext {
    // only for test library type safe
    // should be no '?'
    t?: I18nTranslate;
    // should be no '?'
    locale?: string;
  }
  interface NextContext {
    // only for test library type safe
    // should be no '?'
    user?: string;
    // should be no '?'
    messages?: any;
    // should be no '?'
    extraContent?: {
      from: string;
    };
  }
}
