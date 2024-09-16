import { attachPrototype } from '@/lib/class'

import type { TStation } from '../base'

interface ILrtStation {
  id: number
  _name: string
  _lat: number
  _lon: number
}

export type LrtStation = ILrtStation & TStation

export function LrtStation(props: ILrtStation): LrtStation {
  return attachPrototype({ ...props }, LrtStation.prototype)
}

const implStationForKmbStation: TStation = {
  name(this: LrtStation) {
    return this._name
  },
  lat(this: LrtStation) {
    return this._lat
  },
  lon(this: LrtStation) {
    return this._lon
  },
  distance(this: LrtStation, { lat, lon }: { lat: number, lon: number }) {
    return Math.sqrt((this.lat() - lat) ** 2 + (this.lon() - lon) ** 2)
  },
}

LrtStation.prototype = implStationForKmbStation
