import { describe, expect, it, vi, afterEach } from 'vitest'
import { createCache } from './cache.js'

describe('createCache', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('stores and retrieves values before TTL expires', () => {
    const cache = createCache(1000)
    cache.set('key', { ok: true })
    expect(cache.get('key')).toEqual({ ok: true })
  })

  it('expires entries after TTL', () => {
    vi.useFakeTimers()
    const cache = createCache(500)
    cache.set('key', 'value')
    vi.advanceTimersByTime(501)
    expect(cache.get('key')).toBeUndefined()
  })
})
