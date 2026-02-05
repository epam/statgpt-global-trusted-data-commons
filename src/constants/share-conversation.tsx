import { IconUpload } from '@tabler/icons-react';
import { ShareConversationProps } from '@epam/statgpt-conversation-view';
import { AuthHandler } from '../utils/auth/requests-wrapper';
import { getConversationApi } from '../app/api/conversations/client';
import {
  generateConversationLinkApi,
  getSharedConversationsApi,
  revokeSharedConversationsApi,
} from '../app/api/share/client';

export const SHARE_CONVERSATION_PROPS = (
  authHandler: AuthHandler,
): ShareConversationProps => ({
  shareIcon: <IconUpload />,
  getConversation: authHandler(getConversationApi),
  generateConversationLink: generateConversationLinkApi,
  getSharedConversations: authHandler(getSharedConversationsApi),
  revokeSharedConversations: authHandler(revokeSharedConversationsApi),
});
