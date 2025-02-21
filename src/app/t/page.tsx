import { ClientT } from '@/components/ClientT';
import { I18nProvider } from '@/i18n/context';
import { createPage } from '@/middlewares';
import { getNextContext } from '@/utils/getNextContext';

export default createPage(async function TPage() {
  const { t, locale, messages } = getNextContext();

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
      <hr />
      <I18nProvider locale={locale!} messages={messages!}>
        <ClientT />
      </I18nProvider>
    </div>
  );
});
