import { attachPrototype } from '@/lib/class'

import type { TStation } from '../base'

interface IKmbStation {
  id: string
  _name: string
  _lat: number
  _lon: number
}

export type KmbStation = IKmbStation & TStation

export function KmbStation(props: IKmbStation): KmbStation {
  return attachPrototype({ ...props }, KmbStation.prototype)
}

const implStationForKmbStation: TStation = {
  name(this: KmbStation) {
    return this._name
  },
  lat(this: KmbStation) {
    return this._lat
  },
  lon(this: KmbStation) {
    return this._lon
  },
  distance(this: KmbStation, { lat, lon }: { lat: number, lon: number }) {
    return Math.sqrt((this.lat() - lat) ** 2 + (this.lon() - lon) ** 2)
  },
}

KmbStation.prototype = implStationForKmbStation
