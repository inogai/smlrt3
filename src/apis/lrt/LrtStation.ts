import { attachPrototype } from '@/lib/class'

import { implStation, type TStation } from '../base'

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

const implStationForKmbStation: TStation = attachPrototype({
  name(this: LrtStation) {
    return this._name
  },
  lat(this: LrtStation) {
    return this._lat
  },
  lon(this: LrtStation) {
    return this._lon
  },
}, implStation)

LrtStation.prototype = implStationForKmbStation
