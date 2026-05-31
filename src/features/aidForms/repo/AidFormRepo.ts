// aidForm repository layer responsible for making HTTP requests to the backend.
import { apiClient } from '../../../shared/api/apiClients'
import type { AidFormPayload, AidFormResponse } from '../types/aidFormTypes'

class AidFormRepo {
  async submitAidForm(payload: AidFormPayload): Promise<AidFormResponse> {
    const response = await apiClient.post<AidFormResponse>('/applications', payload)
    return {
      ...response.data,
      success: response.data?.success ?? (response.status >= 200 && response.status < 300),
    }
  }
}

export default AidFormRepo

