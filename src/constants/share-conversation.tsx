import {
  getConversation,
  generateConversationLink,
  getSharedConversations,
  revokeSharedConversations,
} from '../app/actions/conversations';
import { IconUpload } from '@tabler/icons-react';
import { ShareConversationProps } from '@epam/statgpt-conversation-view';
import { AuthHandler } from '../utils/auth/requests-wrapper';

export const SHARE_CONVERSATION_PROPS = (
  authHandler: AuthHandler,
): ShareConversationProps => ({
  shareIcon: <IconUpload />,
  getConversation: authHandler(getConversation),
  generateConversationLink: authHandler(generateConversationLink),
  getSharedConversations: authHandler(getSharedConversations),
  revokeSharedConversations: authHandler(revokeSharedConversations),
});
