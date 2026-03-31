import { ReactNode } from 'react';
import { I18nProvider } from '../../locales/client';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <I18nProvider locale={locale}>
      <div className="main-layout flex size-full flex-row">{children}</div>
    </I18nProvider>
  );
}
