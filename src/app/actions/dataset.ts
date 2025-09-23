'use server';

import {
  DataMessage,
  DatasetQueryFilters,
  SdmxReferences,
  StructuralMetaData,
} from '@dev-statgpt/sdmx-toolkit';
import { apiLogger } from '../../core/logger';
import { datasetApi } from '../api/api';

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
