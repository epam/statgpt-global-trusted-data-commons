import { NextRequest, NextResponse } from 'next/server';
import { datasetApi } from '../api';
import {
  FileColumnsAttribute,
  SdmxDataFormat,
} from '@epam/statgpt-sdmx-toolkit';
import { apiLogger } from '../../../core/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const urn = searchParams.get('urn') as string;
    const format = searchParams.get('format') as SdmxDataFormat;
    const language = searchParams.get('language') as string;
    const attribute = searchParams.get('attribute') as FileColumnsAttribute;
    const filename = searchParams.get('filename') as string;
    const filters = JSON.parse(searchParams.get('filters') || '{}');
    const isMetadata = searchParams.get('isMetadata') === 'true';

    return datasetApi.downloadDataSet(
      urn,
      format,
      language,
      attribute,
      filters,
      filename,
      isMetadata,
    );
  } catch (error) {
    apiLogger.error('Download API error:', error);
    return NextResponse.json(
      { error: 'Failed to process download request' },
      { status: 500 },
    );
  }
}
