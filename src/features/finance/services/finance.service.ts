import { schoolsApi } from '../../schools/api/schools.api'
import type { School } from '../types/finance.types'

export const fetchSchoolsByIds = async (ids: string[]): Promise<School[]> => {
  const results = await Promise.all(ids.map((id) => schoolsApi.getById(id)))
  return results.filter((s): s is School => s !== null)
}
