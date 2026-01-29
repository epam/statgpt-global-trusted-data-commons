import { getToken } from 'next-auth/jwt';
import NextClient from '../../../../utils/auth/nextauth-client';
import { chatLogger } from '../../../../core/logger';
import { NextRequest } from 'next/server';
import { parseCommaSeparatedList } from '../../../../utils/auth/parse-providers-string';

const DEFAULT_LOGOUT_REDIRECT_URI =
  process.env.NEXTAUTH_URL || 'http://localhost:4200/';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token || typeof token.providerId !== 'string') {
      chatLogger.warn('Token is missing or providerId not found.');
      return Response.json({ url: null });
    }

    const federatedLogoutProviders = parseCommaSeparatedList(
      process.env.FEDERATED_LOGOUT_PROVIDERS,
    );

    if (!federatedLogoutProviders.includes(token.providerId)) {
      return Response.json({ url: null });
    }

    const client = NextClient.getClient(token.providerId);

    if (!client) {
      chatLogger.warn(`Client for providerId ${token.providerId} not found.`);
      return Response.json({ url: null });
    }

    const url = client.endSessionUrl({
      post_logout_redirect_uri: DEFAULT_LOGOUT_REDIRECT_URI,
      id_token_hint: token.idToken as string,
    });

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
