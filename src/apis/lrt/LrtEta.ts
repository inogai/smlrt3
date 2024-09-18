import { attachPrototype } from '@/lib/class'

import type { TEta } from '../base'
import type { EtaDescriptor } from '../EtaDescriptor'
import type { LrtRoute } from './LrtRoute'
import type { LrtStation } from './LrtStation'

export interface ILrtEta {
  _route: LrtRoute
  _stop: LrtStation
  _items: {
    val: EtaDescriptor
    trainLength: number
    rmk?: string
  }[]
}

export type LrtEta = ILrtEta & TEta & {
  addEta: (
    eta: {
      val: EtaDescriptor
      trainLength: number
      rmk?: string
    }
  ) => void
}

const implEtaForLrtEta: TEta = {
  route(this: LrtEta) {
    return this._route
  },
  station(this: LrtEta) {
    return this._stop
  },
  items(this: LrtEta) {
    return this._items
  },
  co(this: LrtEta) {
    return 'LRT'
  },
}

const LrtEtaPrototype
= attachPrototype(implEtaForLrtEta, {
  addEta(
    this: LrtEta,
    eta: {
      val: EtaDescriptor
      trainLength: number
      rmk?: string
    },
  ): void {
    this._items.push(eta)
  },
})

export function LrtEta(data: { route: LrtRoute, stop: LrtStation }): LrtEta {
  return attachPrototype({
    _route: data.route,
    _stop: data.stop,
    _items: [],
    _etaSeqs: [],
  }, LrtEtaPrototype)
}
