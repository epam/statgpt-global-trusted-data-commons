import { signOut } from 'next-auth/react';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';
import { chatLogger } from '../../core/logger';

export const customSignOut = async (): Promise<void> => {
  try {
    const res = await fetch('/api/auth/federated-logout');
    const { url }: { url: string | null } = await res.json();
    await signOut({ redirect: true });
    chatLogger.info('SignOut successfully');

    if (url) {
      const parsedUrl = parseUrl(url);
      window.location.href = parsedUrl.href;
    }
  } catch (error) {
    chatLogger.error('Error during sign out:', { error });
    await signOut({ redirect: true });
  }
};
