export type LatLng = { lat: number; lng: number }

const CACHE_KEY = 'africatrip:geocode:v1'
const memCache = new Map<string, LatLng | null>()

function loadCache(): Record<string, LatLng | null> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function saveCache(cache: Record<string, LatLng | null>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // localStorage indisponível/cheio — cache em memória ainda cobre a sessão atual
  }
}

/**
 * Geocodifica um nome de lugar via Nominatim (OpenStreetMap), sem API key.
 * Cacheado em localStorage por texto de busca — cada lugar só é resolvido
 * uma vez (respeita o limite de 1 req/s do serviço gratuito).
 */
export async function geocode(query: string): Promise<LatLng | null> {
  if (memCache.has(query)) return memCache.get(query) ?? null

  const diskCache = loadCache()
  if (query in diskCache) {
    const cached = diskCache[query]
    memCache.set(query, cached)
    return cached
  }

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`)
    const data = await res.json()
    const result: LatLng | null = data[0] ? { lat: Number(data[0].lat), lng: Number(data[0].lon) } : null
    memCache.set(query, result)
    saveCache({ ...diskCache, [query]: result })
    return result
  } catch {
    return null
  }
}

/** Geocodifica uma lista de textos em sequência (não paralelo, pra respeitar o rate limit). */
export async function geocodeAll(queries: string[]): Promise<Map<string, LatLng | null>> {
  const result = new Map<string, LatLng | null>()
  for (const q of queries) {
    result.set(q, await geocode(q))
  }
  return result
}
