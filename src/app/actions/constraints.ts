'use server';

import { SeriesFilterDto, StructuralMetaData } from '@dev-statgpt/sdmx-toolkit';
import { apiLogger } from '../../core/logger';
import { availabilityApi } from '../api/api';

export async function getConstraints(
  urn: string,
  filters?: SeriesFilterDto[],
): Promise<StructuralMetaData> {
  try {
    return await availabilityApi.getConstraints(urn, filters);
  } catch (error) {
    apiLogger.error(`Failed to fetch constraints ${urn}: ${error}`);
    throw new Error('Failed to fetch constraints');
  }
}
