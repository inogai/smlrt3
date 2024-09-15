import type { Hashable, Primitive } from '@/lib/traits'

function hashSymbol(obj: Hashable | Primitive): symbol {
  if (
    typeof obj === 'string'
    || typeof obj === 'number'
    || typeof obj === 'symbol'
    || typeof obj === 'boolean'
    || obj === null
  ) {
    return Symbol.for(typeof obj + String(obj))
  }
  return obj.hashSymbol()
}

export interface HashMap<K extends Hashable, V> {
  map: Map<symbol, [K, V]>
  set: (key: K, value: V) => void
  get: (key: K) => V | undefined
  has: (key: K) => boolean
  keys: () => K[]
  entries: () => [K, V][]
  values: () => V[]
}

const HashMapPrototype = {
  set<K extends Hashable, V>(this: HashMap<K, V>, key: K, value: V): void {
    this.map.set(hashSymbol(key), [key, value])
  },
  get<K extends Hashable, V>(this: HashMap<K, V>, key: K): V | undefined {
    return this.map.get(hashSymbol(key))?.[1]
  },
  has<K extends Hashable, V>(this: HashMap<K, V>, key: K): boolean {
    return (
      this.map.get(hashSymbol(key))?.some((k) => {
        return k === key
      }) ?? false
    )
  },
  keys<K extends Hashable, V>(this: HashMap<K, V>): K[] {
    return Array.from(this.map.values()).map(([key]) => key)
  },
  entries<K extends Hashable, V>(this: HashMap<K, V>): [K, V][] {
    return Array.from(this.map.values())
  },
  values<K extends Hashable, V>(this: HashMap<K, V>): V[] {
    return Array.from(this.map.values()).map(([, value]) => value)
  },
} as const

export function HashMap<K extends Hashable, V>(): HashMap<K, V> {
  const obj = {
    map: new Map(),
  }
  Object.setPrototypeOf(obj, HashMapPrototype)
  return obj as typeof obj & typeof HashMapPrototype
}
