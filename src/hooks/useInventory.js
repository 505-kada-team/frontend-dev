import { useState, useEffect, useCallback } from "react"
import { getInventories } from "../services/inventoryService"

export function useInventories() {
  const [inventories, setInventories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchItems = useCallback(() => {
    setLoading(true)
    getInventories()
      .then(setInventories)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return { inventories, loading, error, refetch: fetchItems }
}