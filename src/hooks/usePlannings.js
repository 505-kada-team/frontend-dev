import { useState, useEffect, useCallback } from "react"
import { getPlannings } from "@/services/planningService"

export function usePlannings() {
  const [plannings, setPlannings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPlannings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPlannings()
      setPlannings(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlannings()
  }, [fetchPlannings])

  return { plannings, loading, error, refetch: fetchPlannings }
}