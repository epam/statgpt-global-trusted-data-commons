'use client';

import { AdvancedViewProvider } from '@dev-statgpt/conversation-view';
import { ReactNode, useEffect } from 'react';
import ConversationListWrapper from '../../components/ConversationList/ConversationListWrapper';
import { ConversationListProvider } from '../../context/ConversationListContext';
import { I18nProvider } from '../../locales/client';

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  let locale = 'en';

  useEffect(() => {
    const getLocale = async () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      locale = (await params).locale;
    };

    getLocale();
  }, [params]);

  return (
    <I18nProvider locale={locale}>
      <div className="flex h-full flex-row w-full main-layout">
        <AdvancedViewProvider>
          <ConversationListProvider>
            <ConversationListWrapper />
            <main className="flex-1 h-full min-w-0">{children}</main>
          </ConversationListProvider>
        </AdvancedViewProvider>
      </div>
    </I18nProvider>
  );
}
