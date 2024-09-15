import { attachPrototype } from '@/lib/class'
import type { Eq, Hashable } from '@/lib/traits'

import type { TRoute } from '../base'
import { isLwb } from './isLwb'

interface IKmbRoute {
  route: string
  // serviceType: number
  _dest: string
  co: 'KMB' | 'LWB'
}

export type KmbRoute = IKmbRoute & TRoute & Eq & Hashable

const prototype = {
  name(this: KmbRoute): string {
    return this.route
  },
  dest(this: KmbRoute): string {
    return this._dest
  },
  equals(this: KmbRoute, other: KmbRoute): boolean {
    return this.hashSymbol() === other.hashSymbol()
  },
  hashSymbol(this: KmbRoute): symbol {
    return Symbol.for(`KmbRoute_${this.route}_${this._dest}`)
  },
} as const

export function KmbRoute(data: Omit<IKmbRoute, 'co'>): KmbRoute {
  const obj = {
    ...data,
    co: isLwb(data.route)
      ? ('LWB' as const)
      : ('KMB' as const),
  }
  return attachPrototype(obj, prototype)
}
