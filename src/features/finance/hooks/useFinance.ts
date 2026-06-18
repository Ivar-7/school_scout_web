import { useState, useEffect } from 'react'
import { financeApi } from '../api/finance.api'
import type { School } from '../types/finance.types'

export const useFinanceSchools = (ids: string[]) => {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const key = ids.join(',')

  useEffect(() => {
    if (ids.length === 0) {
      setSchools([])
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    financeApi
      .getSchools(ids)
      .then((data) => {
        if (!cancelled) setSchools(data)
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load school fee data.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return { schools, loading, error }
}
