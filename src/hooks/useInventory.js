import { useState, useEffect } from "react"
import { getInventories } from "../services/inventoryService"

export function useInventories() {
  const [inventories, setInventories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getInventories()
      .then(setInventories)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { inventories, loading, error }
}