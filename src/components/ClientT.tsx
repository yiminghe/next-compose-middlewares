'use client';

import { getI18nContext } from '@/i18n/context';

export function ClientT() {
  const { t, c } = getI18nContext();
  return (
    <div>
      <div>
        t:{' '}
        {t('n', {
          n: 'hello',
        })}
      </div>
      <div>T: {c('c', { c: '2' }, { s: <strong /> })}</div>
    </div>
  );
}
