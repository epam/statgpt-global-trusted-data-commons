'use client';

import {
  AdvancedViewProvider,
  ChatMessagesProvider,
  ConversationViewFeatureTogglesProvider,
  ConversationViewSidePanelProvider,
  CrossDatasetAttachmentsProvider,
  DatasetDimensionsMetadataMapProvider,
  OnboardingProvider,
} from '@epam/statgpt-conversation-view';
import { AgentAvailabilityProvider } from '@epam/statgpt-ui-components';
import { DatasetDimensionsMetadataMap } from '@epam/statgpt-sdmx-toolkit';

export const ClientProvidersWrapper = ({
  children,
  isAgentAvailable,
  isCrossDatasetModeOn,
  isMetadataInSidePanel,
  isTableSettingsFeatureEnabled,
  datasetDimensionsMetadataMap,
}: {
  children: React.ReactNode;
  isAgentAvailable: boolean;
  isCrossDatasetModeOn: boolean;
  isMetadataInSidePanel: boolean;
  isTableSettingsFeatureEnabled: boolean;
  datasetDimensionsMetadataMap: DatasetDimensionsMetadataMap;
}) => {
  return (
    <ConversationViewFeatureTogglesProvider
      isMetadataInSidePanel={isMetadataInSidePanel}
      isCrossDatasetModeOn={isCrossDatasetModeOn}
      isTableSettingsFeatureEnabled={isTableSettingsFeatureEnabled}
    >
      <AgentAvailabilityProvider isAgentAvailable={isAgentAvailable}>
        <DatasetDimensionsMetadataMapProvider
          map={datasetDimensionsMetadataMap}
        >
          <OnboardingProvider>
            <AdvancedViewProvider>
              <CrossDatasetAttachmentsProvider>
                <ConversationViewSidePanelProvider>
                  <ChatMessagesProvider>{children}</ChatMessagesProvider>
                </ConversationViewSidePanelProvider>
              </CrossDatasetAttachmentsProvider>
            </AdvancedViewProvider>
          </OnboardingProvider>
        </DatasetDimensionsMetadataMapProvider>
      </AgentAvailabilityProvider>
    </ConversationViewFeatureTogglesProvider>
  );
};
