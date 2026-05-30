// Application repository layer responsible for making HTTP requests to the backend.
import { apiClient } from '../../../global/api/apiClients'
import type { APIApplicationPayload } from '../services/apiApplicationPayload'

export interface APIApplicationResponse {
  success: boolean
  id?: string
}

class ApplicationRepo {
  async submitApplication(payload: APIApplicationPayload): Promise<APIApplicationResponse> {
    const response = await apiClient.post<APIApplicationResponse>('/applications', payload)
    return {
      ...response.data,
      success: response.data?.success ?? (response.status >= 200 && response.status < 300),
    }
  }
}

export default ApplicationRepo
