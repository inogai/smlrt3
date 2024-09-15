import type { ResultPromise } from '@/lib/results'

export interface TStation {
  name: () => string
  lat: () => number
  lon: () => number
}

export interface TRoute {
  name: () => string
  dest: () => string
}

export interface TEta {
  route: () => TRoute
  station: () => TStation
}

export interface BaseApi {
  getStations: () => ResultPromise<TStation[], Error>
  getNearbyEtas: (lat: number, lon: number) => ResultPromise<TEta[], Error>
}
