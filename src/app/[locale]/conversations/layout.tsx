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
import { parseBoolean } from '@epam/statgpt-shared-toolkit';
import { DeploymentConfigProvider } from '../../../context/DeploymentConfigProvider';
import { ClientProvidersWrapper } from '../../../components/ClientProvidersWrapper/ClientProvidersWrapper';
import { NoAccessView } from '../../../components/NoAccessView';
import { ComponentsConfig } from '../../../components/configs/ComponentsConfig/ComponentsConfig';
import { TextsConfig } from '../../../components/configs/TextsConfig/TextsConfig';
import { buildDatasetDimensionsMetadataMap } from '@epam/statgpt-sdmx-toolkit';
import { getDatasetsMetadata } from '../../actions/datasets-metadata';

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

  const metadata = await getDatasetsMetadata();
  const datasetDimensionsMetadataMap = metadata.data
    ? buildDatasetDimensionsMetadataMap(metadata.data)
    : {};

  const contentManagementPolicyUrl = process.env.CONTENT_MANAGEMENT_POLICY_URL;
  const isCrossDatasetModeOn = parseBoolean(process.env.CROSS_DATASET_MODE);
  const isMetadataInSidePanel = isCrossDatasetModeOn;
  const isTableSettingsFeatureEnabled = isCrossDatasetModeOn;

  return (
    <ComponentsConfig>
      <TextsConfig
        clientContactSupportUrl={clientContactSupportUrl}
        contentManagementPolicyUrl={contentManagementPolicyUrl}
      >
        <DeploymentConfigProvider config={configuration.data}>
          <ClientProvidersWrapper
            datasetDimensionsMetadataMap={datasetDimensionsMetadataMap}
            isAgentAvailable={configuration.success}
            isCrossDatasetModeOn={isCrossDatasetModeOn}
            isMetadataInSidePanel={isMetadataInSidePanel}
            isTableSettingsFeatureEnabled={isTableSettingsFeatureEnabled}
          >
            <ConversationListProvider>
              <ConversationListWrapper
                clientContactSupportUrl={clientContactSupportUrl}
              />
              <main className="h-full min-w-0 flex-1">{children}</main>
            </ConversationListProvider>
          </ClientProvidersWrapper>
        </DeploymentConfigProvider>
      </TextsConfig>
    </ComponentsConfig>
  );
}
