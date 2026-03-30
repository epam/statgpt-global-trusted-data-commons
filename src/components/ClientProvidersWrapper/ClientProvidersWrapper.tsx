'use client';

import {
  AdvancedViewProvider,
  ChatMessagesProvider,
  ConversationViewFeatureTogglesProvider,
  ConversationViewSidePanelProvider,
  OnboardingProvider,
} from '@epam/statgpt-conversation-view';
import { AgentAvailabilityProvider } from '@epam/statgpt-ui-components';

export const ClientProvidersWrapper = ({
  children,
  isAgentAvailable,
  isCrossDatasetModeOn,
  isMetadataInSidePanel,
  isTableSettingsFeatureEnabled,
}: {
  children: React.ReactNode;
  isAgentAvailable: boolean;
  isCrossDatasetModeOn: boolean;
  isMetadataInSidePanel: boolean;
  isTableSettingsFeatureEnabled: boolean;
}) => {
  return (
    <ConversationViewFeatureTogglesProvider
      isMetadataInSidePanel={isMetadataInSidePanel}
      isCrossDatasetModeOn={isCrossDatasetModeOn}
      isTableSettingsFeatureEnabled={isTableSettingsFeatureEnabled}
    >
      <AgentAvailabilityProvider isAgentAvailable={isAgentAvailable}>
        <OnboardingProvider>
          <AdvancedViewProvider>
            <ConversationViewSidePanelProvider>
              <ChatMessagesProvider>{children}</ChatMessagesProvider>
            </ConversationViewSidePanelProvider>
          </AdvancedViewProvider>
        </OnboardingProvider>
      </AgentAvailabilityProvider>
    </ConversationViewFeatureTogglesProvider>
  );
};
