import { useMemo } from "react"

// Prioritizes city matches before country matches
export function useTypeahead(
  items: string[],
  query: string,
  limit = 10
): string[] {
  const q = query.trim().toLowerCase()

  return useMemo(() => {
    if (!q) return []

    const cityMatches: string[] = []
    const countryMatches: string[] = []

    for (const key of items) {
      const [city = "", country = ""] = key.toLowerCase().split(", ")

      if (city.startsWith(q)) {
        cityMatches.push(key)
      } else if (country.startsWith(q)) {
        countryMatches.push(key)
      }

    }

    return [...cityMatches, ...countryMatches].slice(0, limit)
  }, [items, q, limit])
}
