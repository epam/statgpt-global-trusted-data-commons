import { StructuralMetaData } from '@epam/statgpt-sdmx-toolkit';
import {
  ApiResponse,
  X_SOURCE_ARTEFACT_URN_HEADER,
} from '@epam/statgpt-shared-toolkit';
import { apiRequest } from '../api-client';

export async function getAvailableHierarchiesApi(
  urn: string,
  sourceArtefactUrn?: string,
): Promise<ApiResponse<StructuralMetaData>> {
  const headers: Record<string, string> = {};
  if (sourceArtefactUrn) {
    headers[X_SOURCE_ARTEFACT_URN_HEADER] = sourceArtefactUrn;
  }

  return apiRequest<StructuralMetaData>(
    `/api/codelist/${urn}`,
    'Failed to fetch hierarchies',
    { headers },
  );
}
