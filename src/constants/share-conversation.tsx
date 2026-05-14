import IconShare from '../../public/images/share.svg';
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
  shareIcon: <IconShare height={16} width={16} />,
  getConversation: authHandler(getConversationApi),
  generateConversationLink: generateConversationLinkApi,
  getSharedConversations: authHandler(getSharedConversationsApi),
  revokeSharedConversations: authHandler(revokeSharedConversationsApi),
});
