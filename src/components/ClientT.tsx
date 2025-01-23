'use client';

import { getI18nContext } from '@/i18n/context';

export function ClientT() {
  const { t, T } = getI18nContext();
  return (
    <div>
      <div>
        t:{' '}
        {t('n', {
          n: 'hello',
        })}
      </div>
      <div>
        T: <T i18nKey="c" values={{ c: '2' }} components={{ s: <strong /> }} />
      </div>
    </div>
  );
}
