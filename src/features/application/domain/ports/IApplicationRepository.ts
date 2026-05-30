// Application domain ports.
// Defines abstractions for repositories and services used by application controllers.
// Application domain port interface.

import type { APIApplicationPayload } from '../../services/apiApplicationPayload'
import type { APIApplicationResponse } from '../../repo/ApplicationRepo'

export interface IApplicationRepository {
  submitApplication(payload: APIApplicationPayload): Promise<APIApplicationResponse>
}
