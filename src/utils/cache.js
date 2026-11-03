const DEFAULT_TTL_MS = 1000 * 60 * 15

export function createCache(ttlMs = DEFAULT_TTL_MS) {
  const store = new Map()

  function get(key) {
    const entry = store.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      store.delete(key)
      return undefined
    }
    return entry.value
  }

  function set(key, value) {
    store.set(key, { value, expiresAt: Date.now() + ttlMs })
  }

  function has(key) {
    return get(key) !== undefined
  }

  function clear() {
    store.clear()
  }

  return { get, set, has, clear }
}
