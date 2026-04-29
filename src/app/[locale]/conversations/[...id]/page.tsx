import ConversationViewWrapper from '../../../../components/ConversationView/ConversationViewWrapper';
import { getSignInLink } from '../../../../constants/auth';
import { ApplicationRoute } from '../../../../types/application-routes';
import { getUserToken } from '../../../../utils/auth/auth-request';
import { getIsEnableAuthToggle } from '../../../../utils/auth/get-auth-toggle';
import { getIsInvalidSession } from '../../../../utils/auth/is-valid-session';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string[] }>;
}) {
  const { locale, id } = await params;
  // Join the array parts to reconstruct the full conversation ID
  const bucketId = id[0];
  const conversationId = id.slice(1).join('/');

  const isEnableAuth = getIsEnableAuthToggle();
  const token = await getUserToken(isEnableAuth, headers(), cookies());
  const isInvalidSession = await getIsInvalidSession(isEnableAuth, token);

  if (isInvalidSession) {
    return redirect(
      getSignInLink(
        `/${locale}${ApplicationRoute.Conversations}/${id.map(encodeURIComponent).join('/')}`,
      ),
    );
  }

  const bannerMessage = process.env.INFO_BANNER_MESSAGE;

  return (
    <ConversationViewWrapper
      bucketId={bucketId}
      conversationId={conversationId}
      token={token}
      bannerMessage={bannerMessage}
    />
  );
}
