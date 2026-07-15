import { useState, useEffect, useCallback } from "react"
import { getPlannings } from "@/services/planningService"

export function usePlannings(enabled = true) {
  const [plannings, setPlannings] = useState([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState(null)

  const fetchPlannings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPlannings({ limit: 100})
      setPlannings(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    if (enabled) fetchPlannings()
  }, [enabled, fetchPlannings])

  return { plannings, loading, error, refetch: fetchPlannings }
}