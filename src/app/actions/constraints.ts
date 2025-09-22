'use server';

import { apiLogger } from '../../core/logger';
import { availabilityApi } from '../api/api';
import { StructuralMetaData } from '@statgpt/sdmx-toolkit/src/models/structural-metadata';
import { SeriesFilterDto } from '@statgpt/sdmx-toolkit/src/models/series-filter';

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
