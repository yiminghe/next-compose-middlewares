import { ClientT } from '@/components/ClientT';
import { I18nProvider } from 'next-context/i18n';
import { createPage } from '@/middlewares';
import { getNextContext } from 'next-context';
import { SharedT } from '@/components/SharedT';

export default createPage(async function TPage() {
  const { locale, messages } = getNextContext();

  return (
    <div>
      <SharedT />
      <hr />
      <I18nProvider locale={locale!} messages={messages!}>
        <ClientT />
      </I18nProvider>
    </div>
  );
});
