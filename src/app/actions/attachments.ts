'use server';

import { conversationApi } from '../api/api';
import { apiLogger } from '../../core/logger';
import { GridAttachmentContent } from '@statgpt/dial-toolkit/src/models/grid-attachment';
import { cookies, headers } from 'next/headers';
import { getUserToken } from '../../utils/auth/auth-request';
import { getIsEnableAuthToggle } from '../../utils/auth/get-auth-toggle';

export async function getFile(
  filePath: string,
): Promise<GridAttachmentContent | null> {
  try {
    const isEnableAuth = getIsEnableAuthToggle();
    const token = await getUserToken(isEnableAuth, headers(), cookies());
    return await conversationApi.getFile(
      filePath,
      token?.access_token as string,
    );
  } catch (error) {
    apiLogger.error(`Failed to fetch file: ${error}`);
    throw new Error('Failed to fetch file');
  }
}

export async function getFileBlob(filePath: string): Promise<Blob> {
  try {
    const isEnableAuth = getIsEnableAuthToggle();
    const token = await getUserToken(isEnableAuth, headers(), cookies());
    return (await conversationApi.getFileBlob(
      filePath,
      token?.access_token as string,
    )) as Blob;
  } catch (error) {
    apiLogger.error(`Failed to fetch file: ${error}`);
    throw new Error('Failed to fetch file');
  }
}
