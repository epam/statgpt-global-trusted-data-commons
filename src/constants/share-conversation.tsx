import {
  getConversation,
  generateConversationLink,
  getSharedConversations,
  revokeSharedConversations,
} from '../app/actions/conversations';
import { IconUpload } from '@tabler/icons-react';
import { ShareConversationProps } from '@dev-statgpt/conversation-view';

export const SHARE_CONVERSATION_PROPS: ShareConversationProps = {
  shareIcon: <IconUpload />,
  getConversation,
  generateConversationLink,
  getSharedConversations,
  revokeSharedConversations,
};
