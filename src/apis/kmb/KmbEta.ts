import { attachPrototype } from '@/lib/class'

import type { TEta } from '../base'
import type { EtaDescriptor } from '../EtaDescriptor'
import type { KmbRoute } from './KmbRoute'
import type { KmbStation } from './KmbStation'

export interface IKmbEta {
  _route: KmbRoute
  _stop: KmbStation
  etas: {
    val: EtaDescriptor
    rmk?: string
  }[]
  etaSeqs: number[]
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

const KmbEtaPrototype = {
  route(this: KmbEta) {
    return this._route
  },

  station(this: KmbEta) {
    return this._stop
  },

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
    if (this.etaSeqs.includes(etaSeq))
      return

    this.etaSeqs.push(etaSeq)
    this.etas.push(eta)
  },
} as const

export function KmbEta(data: { route: KmbRoute, stop: KmbStation }): KmbEta {
  return attachPrototype({
    _route: data.route,
    _stop: data.stop,
    etas: [],
    etaSeqs: [],
  }, KmbEtaPrototype)
}
