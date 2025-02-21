'use client';

import { getI18nContext } from '@/i18n/context';

export function ClientT() {
  const { t } = getI18nContext();
  return (
    <div>
      <div>
        t:{' '}
        {t('n', {
          n: 'hello',
        })}
      </div>
      <div>
        T:{' '}
        {t('c', { c: '2', s: (chunks) => <strong key="1">{chunks}</strong> })}
      </div>
    </div>
  );
}
