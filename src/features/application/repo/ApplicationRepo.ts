// Application repositories.
// Handles backend API calls and maps request/response payloads for the feature.
// Application repository layer responsible for making HTTP requests to the backend.

import { apiClient } from '../../../shared/api/apiClients'
import API_ENDPOINTS from '../../../shared/constants/apiEndpoints'
import type { APIApplicationPayload } from '../services/apiApplicationPayload'
import type { IApplicationRepository } from '../domain/ports/IApplicationRepository'

export interface APIApplicationResponse {
  success: boolean
  id?: string
}

class ApplicationRepo implements IApplicationRepository {
  async submitApplication(payload: APIApplicationPayload): Promise<APIApplicationResponse> {
    const response = await apiClient.post<APIApplicationResponse>(API_ENDPOINTS.APPLICATIONS, payload)
    return {
      ...response.data,
      success: response.data?.success ?? (response.status >= 200 && response.status < 300),
    }
  }
}

export default ApplicationRepo
