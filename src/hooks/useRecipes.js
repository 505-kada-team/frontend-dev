import { useState, useEffect, useCallback } from 'react';
import { getRecipes } from '@/services/recipeService';

export function useRecipes(enabled = true) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState(null)

  const fetchRecipes = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    setError(null)
    try {
      const data = await getRecipes({ limit: 100 })
      setRecipes(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    if (enabled) fetchRecipes()
  }, [enabled, fetchRecipes])

  return { recipes, loading, error, refetch: fetchRecipes }
}