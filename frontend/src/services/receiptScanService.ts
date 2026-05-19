import type { ServiceResponse } from '../types';
import { extractServiceError } from './apiMappers';
import { getApiClient } from './httpClient';

export interface ReceiptScanResult {
  storeName:     string | null;
  amount:        number | null;
  category:      string | null;
  date:          string | null;
  paymentMethod: string | null;
  notes:         string | null;
}

export async function scanReceipt(
  qrUrl: string
): Promise<ServiceResponse<ReceiptScanResult>> {
  try {
    const response = await getApiClient().post('/api/receiptscan/scan', {
      qrUrl,
    });
    return { success: true, data: response.data as ReceiptScanResult };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, 'Failed to scan receipt. Please try again.'),
    };
  }
}
