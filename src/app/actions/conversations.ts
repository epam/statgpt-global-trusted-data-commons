'use server';

import { Conversation, ConversationInfo } from '@epam/ai-dial-shared';
import { getBucket } from './bucket';
import { conversationApi, DEFAULT_MODEL_ID } from '../api/api';
import { apiLogger } from '../../core/logger';
import {
  ConversationData,
  CreateConversationRequest,
  GeneratedLinkResponse,
  SharedConversations,
  SharedConversationsRequest,
  UpdateConversationRequest,
} from '@dev-statgpt/dial-toolkit';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { getUserToken } from '../../utils/auth/auth-request';
import { getIsEnableAuthToggle } from '../../utils/auth/get-auth-toggle';

const CONVERSATIONS_URL = '/conversations';

export async function getConversations(
  locale?: string,
): Promise<ConversationInfo[]> {
  try {
    const isEnableAuth = getIsEnableAuthToggle();
    const token = await getUserToken(isEnableAuth, headers(), cookies());

    //TODO: update with locales folders logic
    // First get the user's bucket
    const bucketResponse = await getBucket();
    const bucket = bucketResponse.bucket;

    // Then fetch conversations for that bucket
    return await conversationApi.getConversations(
      token?.access_token as string,
      bucket,
      locale,
    );
  } catch (error) {
    apiLogger.error(`Failed to fetch conversations: ${error}`);
    throw new Error('Failed to fetch conversations');
  }
}

export async function getConversation(
  conversationId: string,
): Promise<Conversation> {
  try {
    const isEnableAuth = getIsEnableAuthToggle();
    const token = await getUserToken(isEnableAuth, headers(), cookies());
    const conversation = await conversationApi.getConversation(
      conversationId,
      token?.access_token as string,
    );
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return conversation;
  } catch (error) {
    apiLogger.error(`Failed to fetch conversation: ${error}`);
    throw new Error('Failed to fetch conversation');
  }
}

export async function createConversation(
  request: CreateConversationRequest,
): Promise<ConversationInfo> {
  try {
    const isEnableAuth = getIsEnableAuthToggle();
    const token = await getUserToken(isEnableAuth, headers(), cookies());
    const conversation = await conversationApi.createConversation(
      {
        ...request,
        model: { id: DEFAULT_MODEL_ID },
      },
      token?.access_token as string,
    );
    revalidatePath(CONVERSATIONS_URL);
    return conversation;
  } catch (error) {
    apiLogger.error(`Failed to create conversation: ${error}`);
    throw new Error('Failed to create conversation');
  }
}

export async function updateConversation(
  conversationId: string,
  request: UpdateConversationRequest,
): Promise<ConversationInfo> {
  try {
    const isEnableAuth = getIsEnableAuthToggle();
    const token = await getUserToken(isEnableAuth, headers(), cookies());
    return await conversationApi.updateConversation(
      conversationId,
      request,
      token?.access_token as string,
    );
  } catch (error) {
    apiLogger.error(`Failed to update conversation: ${error}`);
    throw new Error('Failed to update conversation');
  }
}

export async function deleteConversation(
  conversation: ConversationInfo,
): Promise<void> {
  try {
    const isEnableAuth = getIsEnableAuthToggle();
    const token = await getUserToken(isEnableAuth, headers(), cookies());
    await conversationApi.deleteConversation(
      conversation,
      token?.access_token as string,
    );
    revalidatePath(CONVERSATIONS_URL);
  } catch (error) {
    apiLogger.error(`Failed to delete conversation: ${error}`);
    throw new Error('Failed to delete conversation');
  }
}

export async function generateConversationLink(
  conversationData?: ConversationData,
): Promise<GeneratedLinkResponse> {
  try {
    const isEnableAuth = getIsEnableAuthToggle();
    const token = await getUserToken(isEnableAuth, headers(), cookies());
    return await conversationApi.generateConversationLink(
      token?.access_token as string,
      conversationData,
    );
  } catch (error) {
    apiLogger.error(`Failed to generate conversation link: ${error}`);
    throw new Error('Failed to generate conversation link');
  }
}

export async function getSharedConversations(
  requestData?: SharedConversationsRequest,
): Promise<SharedConversations> {
  try {
    const isEnableAuth = getIsEnableAuthToggle();
    const token = await getUserToken(isEnableAuth, headers(), cookies());
    return await conversationApi.getSharedConversations(
      token?.access_token as string,
      requestData,
    );
  } catch (error) {
    apiLogger.error(`Failed to get shared conversations: ${error}`);
    throw new Error('Failed to get shared conversations');
  }
}

export async function revokeSharedConversations(
  sharedConversations?: SharedConversations,
): Promise<void> {
  try {
    const isEnableAuth = getIsEnableAuthToggle();
    const token = await getUserToken(isEnableAuth, headers(), cookies());
    return await conversationApi.revokeSharedConversations(
      token?.access_token as string,
      sharedConversations,
    );
  } catch (error) {
    apiLogger.error(`Failed to revoke shared conversations: ${error}`);
    throw new Error('Failed to revoke shared conversations');
  }
}
