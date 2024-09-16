import type { ResultPromise } from '@/lib/results'

import type { EtaDescriptor } from './EtaDescriptor'

export interface TStation {
  name: () => string
  lat: () => number
  lon: () => number
  distance: (coords: { lat: number, lon: number }) => number
}

export interface TRoute {
  name: () => string
  dest: () => string
}

export interface TEta {
  route: () => TRoute
  station: () => TStation
  items: () => {
    val: EtaDescriptor
    rmk?: string
  }[]
}

export interface BaseApi {
  getStations: () => ResultPromise<TStation[], Error>
  getNearbyEtas: (lat: number, lon: number) => ResultPromise<TEta[], Error>
}
