/**
 * aidForm service layer responsible for orchestrating submission logic.
 * Keeps feature validation and payload transformation outside of UI components.
 */
import type { AidFormValues } from '../types/aidFormTypes'
import AidFormRepo from '../repo/AidFormRepo'

class AidFormService {
  private aidFormRepo: AidFormRepo

  constructor(aidFormRepo: AidFormRepo = new AidFormRepo()) {
    this.aidFormRepo = aidFormRepo
  }

  async submitAidForm(values: AidFormValues): Promise<boolean> {
    const response = await this.aidFormRepo.submitAidForm(values)
    return response.success
  }
}

export default AidFormService

