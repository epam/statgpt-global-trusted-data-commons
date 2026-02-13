'use client';

import {
  AdvancedViewProvider,
  ChatMessagesProvider,
  OnboardingProvider,
} from '@epam/statgpt-conversation-view';
import { AgentAvailabilityProvider } from '@epam/statgpt-ui-components';

export const ClientProvidersWrapper = ({
  children,
  isAgentAvailable,
}: {
  children: React.ReactNode;
  isAgentAvailable: boolean;
}) => {
  return (
    <AgentAvailabilityProvider isAgentAvailable={isAgentAvailable}>
      <OnboardingProvider>
        <AdvancedViewProvider>
          <ChatMessagesProvider>{children}</ChatMessagesProvider>
        </AdvancedViewProvider>
      </OnboardingProvider>
    </AgentAvailabilityProvider>
  );
};
