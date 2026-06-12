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
import {
  DatasetDimensionsMetadataMap,
  DatasetLastUpdatedMap,
} from '@epam/statgpt-sdmx-toolkit';

export const ClientProvidersWrapper = ({
  children,
  isAgentAvailable,
  isCrossDatasetModeOn,
  isMetadataInSidePanel,
  isTableSettingsFeatureEnabled,
  datasetDimensionsMetadataMap,
  datasetLastUpdatedMap,
}: {
  children: React.ReactNode;
  isAgentAvailable: boolean;
  isCrossDatasetModeOn: boolean;
  isMetadataInSidePanel: boolean;
  isTableSettingsFeatureEnabled: boolean;
  datasetDimensionsMetadataMap: DatasetDimensionsMetadataMap;
  datasetLastUpdatedMap: DatasetLastUpdatedMap;
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
          lastUpdatedMap={datasetLastUpdatedMap}
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
