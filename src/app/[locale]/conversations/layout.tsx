import { ReactNode } from 'react';
import { ConversationListProvider } from '../../../context/ConversationListContext';
import ConversationListWrapper from '../../../components/ConversationList/ConversationListWrapper';
import { getIsEnableAuthToggle } from '../../../utils/auth/get-auth-toggle';
import { getIsInvalidSession, getUserToken } from '../../../utils/auth';
import { cookies, headers } from 'next/headers';
import { SIGN_IN_LINK } from '../../../constants/auth';
import { redirect } from 'next/navigation';
import { getDeploymentConfiguration } from '../../actions/configuration';
import { conversationApi, dialApiClient } from '../../api/api';
import { DIAL_API_ROUTES } from '@epam/statgpt-dial-toolkit';
import { DeploymentConfigProvider } from '../../../context/DeploymentConfigProvider';
import { ClientProvidersWrapper } from '../../../components/ClientProvidersWrapper/ClientProvidersWrapper';
import { NoAccessView } from '../../../components/NoAccessView';
import { ComponentsConfig } from '../../../components/configs/ComponentsConfig/ComponentsConfig';
import { TextsConfig } from '../../../components/configs/TextsConfig/TextsConfig';

export default async function ConversationLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const isEnableAuth = getIsEnableAuthToggle();
  const token = await getUserToken(isEnableAuth, headers(), cookies());
  const isInvalidSession = await getIsInvalidSession(isEnableAuth, token);

  if (isInvalidSession) {
    return redirect(SIGN_IN_LINK);
  }

  const { locale } = await params;

  const configuration = await getDeploymentConfiguration();
  let isAnyConversationAvailable = false;

  if (!configuration.success) {
    try {
      const bucket = await dialApiClient.getRequest<{ bucket: string }>(
        DIAL_API_ROUTES.BUCKET,
        token?.access_token as string,
      );

      const conversations = await conversationApi.getConversations(
        token?.access_token as string,
        bucket.bucket,
        locale,
      );

      isAnyConversationAvailable = conversations.length > 0;
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }

  const clientContactSupportUrl = process.env.CLIENT_CONTACT_SUPPORT_URL;

  if (!configuration.success && !isAnyConversationAvailable) {
    return <NoAccessView clientContactSupportUrl={clientContactSupportUrl} />;
  }

  const contentManagementPolicyUrl = process.env.CONTENT_MANAGEMENT_POLICY_URL;

  return (
    <ComponentsConfig>
      <TextsConfig
        clientContactSupportUrl={clientContactSupportUrl}
        contentManagementPolicyUrl={contentManagementPolicyUrl}
      >
        <DeploymentConfigProvider config={configuration.data}>
          <ClientProvidersWrapper isAgentAvailable={configuration.success}>
            <ConversationListProvider>
              <ConversationListWrapper />
              <main className="flex-1 h-full min-w-0">{children}</main>
            </ConversationListProvider>
          </ClientProvidersWrapper>
        </DeploymentConfigProvider>
      </TextsConfig>
    </ComponentsConfig>
  );
}
