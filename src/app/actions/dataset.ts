'use server';

import { StructuralMetaData } from '@statgpt/sdmx-toolkit/src/models/structural-metadata';
import { apiLogger } from '../../core/logger';
import { datasetApi } from '../api/api';
import { DataMessage } from '@statgpt/sdmx-toolkit/src/models/data/data-message';
import { DatasetQueryFilters } from '@statgpt/sdmx-toolkit/src/models/dataset-query-filters';

import { SdmxReferences } from '@statgpt/sdmx-toolkit/src/types/references';

export async function getDataSet(
  urn: string,
  references?: SdmxReferences,
): Promise<StructuralMetaData | null> {
  try {
    return await datasetApi.getDataSet(urn, references);
  } catch (error) {
    apiLogger.error(`Failed to fetch dataflow ${urn}: ${error}`);
    throw new Error('Failed to fetch dataflow');
  }
}

export async function getDataSetData(
  urn: string,
  filters: DatasetQueryFilters,
): Promise<DataMessage | null> {
  try {
    return await datasetApi.getDatasetData(urn, filters);
  } catch (error) {
    apiLogger.error(`Failed to fetch dataset data ${urn}: ${error}`);
    throw new Error('Failed to fetch dataset data');
  }
}
