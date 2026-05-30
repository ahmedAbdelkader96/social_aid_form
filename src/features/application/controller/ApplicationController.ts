// Application controller layer.
// Orchestrates feature business rules and delegates to repository implementations.

import type { ApplicationFormValues } from '../models/applicationTypes'
import type { APIApplicationResponse } from '../repo/ApplicationRepo'
import type { APIApplicationPayload } from '../services/apiApplicationPayload'
import type { IApplicationRepository } from '../domain/ports/IApplicationRepository'

export interface ApplicationSubmitResult {
  success: boolean
  submittedAt: string
  applicationId?: string
  response: APIApplicationResponse
}

function normalizeApplicationPayload(values: ApplicationFormValues): APIApplicationPayload {
  return {
    ...values,
  }
}

class ApplicationController {
  private applicationRepo: IApplicationRepository

  constructor(applicationRepo: IApplicationRepository) {
    this.applicationRepo = applicationRepo
    this.submitApplication = this.submitApplication.bind(this)
  }

  async submitApplication(values: ApplicationFormValues): Promise<ApplicationSubmitResult> {
    const payload = normalizeApplicationPayload(values)
    const response = await this.applicationRepo.submitApplication(payload)

    return {
      success: response.success,
      submittedAt: new Date().toISOString(),
      applicationId: response.id,
      response,
    }
  }
}

export default ApplicationController
