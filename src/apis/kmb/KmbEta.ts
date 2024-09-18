import { attachPrototype } from '@/lib/class'

import type { TEta } from '../base'
import type { EtaDescriptor } from '../EtaDescriptor'
import type { KmbRoute } from './KmbRoute'
import type { KmbStation } from './KmbStation'

export interface IKmbEta {
  _route: KmbRoute
  _stop: KmbStation
  _items: {
    val: EtaDescriptor
    rmk?: string
  }[]
  _etaSeqs: number[]
}

export type KmbEta = IKmbEta & TEta & {
  addEta: (
    eta: {
      val: EtaDescriptor
      rmk?: string
    },
    etaSeq: number
  ) => void
}

const implEtaForKmbEta: TEta = {
  route(this: KmbEta) {
    return this._route
  },
  station(this: KmbEta) {
    return this._stop
  },
  items(this: KmbEta) {
    return this._items
  },
  co(this: KmbEta) {
    return 'KMB'
  },
}

const KmbEtaPrototype
= attachPrototype(implEtaForKmbEta, {
  addEta(
    this: KmbEta,
    eta: {
      val: EtaDescriptor
      rmk?: string
    },
    etaSeq: number,
  ): void {
    // Prevent duplicates
    // For some reason, the API sometimes
    // returns duplicate etas with different service types
    if (this._etaSeqs.includes(etaSeq))
      return

    this._etaSeqs.push(etaSeq)
    this._items.push(eta)
  },
})

export function KmbEta(data: { route: KmbRoute, stop: KmbStation }): KmbEta {
  return attachPrototype({
    _route: data.route,
    _stop: data.stop,
    _items: [],
    _etaSeqs: [],
  }, KmbEtaPrototype)
}
