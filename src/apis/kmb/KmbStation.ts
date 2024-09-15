import type { TStation } from '../base'

interface IKmbStation {
  id: string
  name: string
  _lat: number
  _lon: number
}

export type KmbStation = IKmbStation & TStation

export function KmbStation(props: IKmbStation): KmbStation {
  const ret = {
    ...props,
  }

  Object.setPrototypeOf(ret, KmbStation.prototype)

  return ret as IKmbStation & typeof KmbStation.prototype
}

KmbStation.prototype = {
  name(this: KmbStation) {
    return this.name
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
