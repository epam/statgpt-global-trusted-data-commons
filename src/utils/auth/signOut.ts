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
      // `url` is the federated (OIDC) end-session URL. It is built entirely
      // server-side in /api/auth/federated-logout from trusted configuration:
      // the providerId comes from the signed session token, is checked against
      // the FEDERATED_LOGOUT_PROVIDERS allowlist, and the endpoint host is
      // validated against the configured issuer host. It is not derived from
      // any client-controllable input, so this redirect is not an open redirect.
      const parsedUrl = parseUrl(url);
      window.location.href = parsedUrl.href;
    }
  } catch (error) {
    chatLogger.error('Error during sign out:', { error });
    await signOut({ redirect: true });
  }
};
