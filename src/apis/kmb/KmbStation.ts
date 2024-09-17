import { attachPrototype } from '@/lib/class'

import { implStation, type TStation } from '../base'

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

const implStationForKmbStation: TStation = attachPrototype({
  name(this: KmbStation) {
    return this._name
  },
  lat(this: KmbStation) {
    return this._lat
  },
  lon(this: KmbStation) {
    return this._lon
  },
}, implStation)

KmbStation.prototype = implStationForKmbStation
