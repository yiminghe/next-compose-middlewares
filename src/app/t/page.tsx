import { ClientT } from '@/components/ClientT';
import { I18nProvider } from '@/i18n/context';
import { createPage } from '@/middlewares';
import { getNextContext } from '@/next-compose-middlewares';

export default createPage(async function TPage() {
  const { t, T, locale, translation } = getNextContext();
  const TT = T!;
  return (
    <div>
      <div>
        t:{' '}
        {t!('n', {
          n: 'hello',
        })}
      </div>
      <div>
        T: <TT i18nKey="c" values={{ c: '2' }} components={{ s: <strong /> }} />
      </div>
      <hr />
      <I18nProvider locale={locale!} translation={translation!}>
        <ClientT />
      </I18nProvider>
    </div>
  );
});
