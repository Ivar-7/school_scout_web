import { fetchSchoolsByIds } from '../services/finance.service'

export const financeApi = {
  getSchools: (ids: string[]) => fetchSchoolsByIds(ids),
}
