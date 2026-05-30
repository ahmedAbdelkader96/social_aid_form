// Application controller layer defining feature business logic and payload transformation.
import type { ApplicationFormValues } from '../models/applicationTypes'
import ApplicationRepo, { type APIApplicationResponse } from '../repo/ApplicationRepo'
import type { APIApplicationPayload } from '../services/apiApplicationPayload'

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
  private applicationRepo: ApplicationRepo

  constructor() {
    this.applicationRepo = new ApplicationRepo()
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
