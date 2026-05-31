// aidForm repository layer responsible for making HTTP requests to the backend.
import { apiClient } from '../../../shared/api/apiClients'
import { normalizeAxiosError } from '../../../shared/errors'
import type { AidFormPayload, AidFormResponse } from '../types/aidFormTypes'

class AidFormRepo {
  async submitAidForm(payload: AidFormPayload): Promise<AidFormResponse> {
    try {
      const response = await apiClient.post<AidFormResponse>('/applications', payload)
      return {
        ...response.data,
        success: response.data?.success ?? (response.status >= 200 && response.status < 300),
      }
    } catch (error: unknown) {
      const apiError = normalizeAxiosError(error)
      console.error('Aid form submit failed:', apiError)
      throw new Error(apiError.message)
    }
  }
}

export default AidFormRepo

