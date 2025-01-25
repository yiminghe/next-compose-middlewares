import { ClientT } from '@/components/ClientT';
import { I18nProvider } from '@/i18n/context';
import { createPage } from '@/middlewares';
import { getNextContext } from '@/utils/getNextContext';

export default createPage(async function TPage() {
  const { t, c, locale, translation } = getNextContext();

  return (
    <div>
      <div>
        t:{' '}
        {t('n', {
          n: 'hello',
        })}
      </div>
      <div>T: {c('c', { c: '2' }, { s: <strong /> })}</div>
      <hr />
      <I18nProvider locale={locale!} translation={translation!}>
        <ClientT />
      </I18nProvider>
    </div>
  );
});
