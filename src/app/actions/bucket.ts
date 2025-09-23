'use server';

import { dialApiClient } from '../api/api';
import { DIAL_API_ROUTES } from '@dev-statgpt/dial-toolkit';
import { cookies, headers } from 'next/headers';
import { getUserToken } from '../../utils/auth/auth-request';
import { getIsEnableAuthToggle } from '../../utils/auth/get-auth-toggle';

export async function getBucket(): Promise<{ bucket: string }> {
  try {
    const isEnableAuth = getIsEnableAuthToggle();
    const token = await getUserToken(isEnableAuth, headers(), cookies());
    return await dialApiClient.getRequest<{ bucket: string }>(
      DIAL_API_ROUTES.BUCKET,
      token?.access_token as string,
    );
  } catch (error) {
    console.error('Failed to fetch bucket:', error);
    throw new Error('Failed to fetch user bucket');
  }
}
