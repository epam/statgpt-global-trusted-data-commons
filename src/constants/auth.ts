export const SIGN_IN_LINK = '/api/auth/signin';
export const AUTH_CALLBACK_URL_HEADER = 'x-auth-callback-url';

export const getSignInLink = (callbackUrl?: string | null) => {
  const normalizedCallbackUrl = callbackUrl?.trim();

  if (!normalizedCallbackUrl) {
    return SIGN_IN_LINK;
  }

  return `${SIGN_IN_LINK}?${new URLSearchParams({
    callbackUrl: normalizedCallbackUrl,
  }).toString()}`;
};
