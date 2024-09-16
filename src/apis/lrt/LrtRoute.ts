import { attachPrototype } from '@/lib/class'
import type { Eq, Hashable } from '@/lib/traits'

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
