'use server';

import { SeriesFilterDto, StructuralMetaData } from '@dev-statgpt/sdmx-toolkit';
import { apiLogger } from '../../core/logger';
import { availabilityApi } from '../api/api';
import {
  checkSessionInvalid,
  INVALID_SESSION_RESPONSE,
} from '../../utils/auth/check-session';
import { ApiResponse } from '@statgpt/shared-toolkit';
import { makeSuccessResponse } from '../../utils/auth/success-response';

export async function getConstraints(
  urn: string,
  filters?: SeriesFilterDto[],
): Promise<ApiResponse<StructuralMetaData>> {
  try {
    const isInvalidSession = await checkSessionInvalid();
    if (isInvalidSession) {
      return INVALID_SESSION_RESPONSE;
    }
    const constraints = await availabilityApi.getConstraints(urn, filters);
    return makeSuccessResponse(constraints);
  } catch (error) {
    apiLogger.error(`Failed to fetch constraints ${urn}: ${error}`);
    throw new Error('Failed to fetch constraints');
  }
}
