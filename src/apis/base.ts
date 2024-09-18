import haversineDistance from 'haversine-distance'

import type { ResultPromise } from '@/lib/results'

import type { EtaDescriptor } from './EtaDescriptor'

type Coords =
  | { latitude: number, longitude: number }
  | { lat: number, lon: number }

export interface TStation {
  name: () => string
  lat: () => number
  lon: () => number
  /**
   * @returns the distance in meters
   */
  distance: (coords: Coords) => number
}

export interface TRoute {
  name: () => string
  dest: () => string
  color: () => string
}

export interface TEta {
  route: () => TRoute
  station: () => TStation
  items: () => {
    val: EtaDescriptor
    rmk?: string
  }[]
  co: () => string
}

export const implStation: Pick<TStation, 'distance'> = {
  distance(this: TStation, coords: Coords) {
    return haversineDistance({
      latitude: this.lat(),
      longitude: this.lon(),
    }, coords)
  },
}

export interface BaseApi {
  getStations: () => ResultPromise<TStation[], Error>
  getNearbyEtas: (
    lat: number,
    lon: number,
    radius: number
  ) => ResultPromise<TEta[], Error>
}
