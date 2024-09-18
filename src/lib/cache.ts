import * as idb from 'idb-keyval'

interface RefreshedObject<T> {
  value: T
  useCached: false
  lastUpdate: number
}

interface CachedObject<T> {
  value: T
  useCached: true
  lastUpdate: number
}

async function refreshCache<T>(
  key: string,
  callback: () => Promise<T>,
): Promise<RefreshedObject<T>> {
  const ret = await callback()
  const timestamp = Date.now()
  idb.set(key, ret)
  localStorage.setItem(`${key}_timestamp`, timestamp.toString())
  return { value: ret, useCached: false, lastUpdate: timestamp }
}

export async function cache<T>(
  key: string,
  callback: () => Promise<T>,
  ttl: number = 60,
): Promise<RefreshedObject<T> | CachedObject<T>> {
  const timestamp
    = Number.parseInt(localStorage.getItem(`${key}_timestamp`) ?? '0', 10)

  if (Date.now() - timestamp > ttl * 1000)
    return refreshCache(key, callback)

  try {
    const data = await idb.get(key)

    if (data === undefined)
      return refreshCache(key, callback)

    return {
      value: data,
      useCached: true,
      lastUpdate: timestamp,
    }
  }
  catch {
    return refreshCache(key, callback)
  }
}
