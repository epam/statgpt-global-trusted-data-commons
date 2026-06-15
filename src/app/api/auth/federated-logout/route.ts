import { getToken } from 'next-auth/jwt';
import { chatLogger } from '../../../../core/logger';
import { NextRequest } from 'next/server';
import { parseCommaSeparatedList } from '../../../../utils/auth/parse-providers-string';
import {
  discoverOidcMetadata,
  getOidcIssuer,
} from '../../../../utils/auth/oauth-refresh';
import {
  getAuthSecret,
  getSessionCookieName,
} from '../../../../utils/auth/auth-cookie';

const DEFAULT_LOGOUT_REDIRECT_URI =
  process.env.AUTH_URL || process.env.NEXTAUTH_URL || 'http://localhost:4200/';

const getFederatedLogoutUrl = async (
  providerId: string,
  idToken?: string,
): Promise<string | null> => {
  const issuer = getOidcIssuer(providerId);

  if (!issuer) {
    chatLogger.warn(`Issuer for providerId ${providerId} not found.`);
    return null;
  }

  const metadata = await discoverOidcMetadata(issuer);

  if (!metadata.end_session_endpoint) {
    chatLogger.warn(
      `End session endpoint for providerId ${providerId} not found.`,
    );
    return null;
  }

  const url = new URL(metadata.end_session_endpoint);

  // Defense-in-depth: the end_session_endpoint comes from the IdP's discovery
  // document. Reject it if its host does not match the configured, trusted
  // issuer so a misconfigured or compromised discovery doc cannot turn this
  // server-derived logout URL into an open redirect.

  if (url.host !== new URL(issuer).host) {
    chatLogger.warn(
      `End session endpoint host ${url.host} does not match issuer host for providerId ${providerId}.`,
    );
    return null;
  }

  url.searchParams.set('post_logout_redirect_uri', DEFAULT_LOGOUT_REDIRECT_URI);

  if (idToken) {
    url.searchParams.set('id_token_hint', idToken);
  }

  return url.toString();
};

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      cookieName: getSessionCookieName(),
      secret: getAuthSecret(),
    });

    if (!token || typeof token.providerId !== 'string') {
      chatLogger.warn('Token is missing or providerId not found.');
      return Response.json({ url: null });
    }

    const federatedLogoutProviders = parseCommaSeparatedList(
      process.env.FEDERATED_LOGOUT_PROVIDERS,
    );

    console.log('token.providerId', token.providerId);

    if (!federatedLogoutProviders.includes(token.providerId)) {
      return Response.json({ url: null });
    }

    const url = await getFederatedLogoutUrl(
      token.providerId,
      typeof token.idToken === 'string' ? token.idToken : undefined,
    );

    if (!url) {
      chatLogger.warn(
        `End session URL not found for providerId ${token.providerId}.`,
      );
      return Response.json({ url: null });
    }

    return Response.json({ url });
  } catch (error) {
    chatLogger.error('Error during federated logout:', { error });
    return Response.json({ url: null });
  }
}
