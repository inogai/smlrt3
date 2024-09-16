import { attachPrototype } from '@/lib/class'
import type { Eq, Hashable } from '@/lib/traits'
import { cn } from '@/lib/utils'

import type { TRoute } from '../base'

interface ILrtRoute {
  route: string
  _dest: string
}

export type LrtRoute = ILrtRoute & TRoute & Eq & Hashable

const implRouteForLrtRoute: TRoute = {
  name(this: LrtRoute): string {
    return this.route
  },
  dest(this: LrtRoute): string {
    return this._dest
  },
  color(this: LrtRoute): string {
    switch (this.route) {
      case '505':
        return cn(`bg-[#ef2d19]`)
      case '507':
        return cn(`bg-[#00ab4f]`)
      case '610':
        return cn(`bg-[#531b19]`)
      case '614':
        return cn(`bg-[#35ccf6]`)
      case '614P':
        return cn(`bg-[#ff8391]`)
      case '615':
        return cn(`bg-[#ffd939]`)
      case '615P':
        return cn(`bg-[#086285]`)
      case '705':
        return cn(`bg-[#d9eece]`)
      case '706':
        return cn(`bg-[#b07bbd]`)
      case '751':
        return cn(`bg-[#ff7d24]`)
      case '761P':
        return cn(`bg-[#582895]`)
      default:
        return cn(`bg-gray-400`)
    }
  },
}

const implEqForLrtRoute: Eq = {
  equals(this: LrtRoute, other: LrtRoute): boolean {
    return this.hashSymbol() === other.hashSymbol()
  },
}

const implHashableForLrtRoute: Hashable = attachPrototype({
  hashSymbol(this: LrtRoute): symbol {
    return Symbol.for(`LrtRoute_${this.route}_${this._dest}`)
  },
}, implEqForLrtRoute)

export function LrtRoute(data: ILrtRoute): LrtRoute {
  return attachPrototype({ ...data }, LrtRoute.prototype)
}

LrtRoute.prototype = attachPrototype(
  implRouteForLrtRoute,
  implHashableForLrtRoute,
)
