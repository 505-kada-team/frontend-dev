import { useState, useEffect, useCallback } from "react"
import { getRecipes } from "@/services/recipeService"

export function useRecipes() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRecipes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRecipes()
      setRecipes(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  return { recipes, loading, error, refetch: fetchRecipes }
}