import { type Client, createClient } from '@hey-api/client-fetch'

import * as kmb from '@/clients/kmb'
import { PROXY_URL } from '@/env'
import { cache } from '@/lib/cache'
import { HashMap } from '@/lib/HashMap'
import type { Result } from '@/lib/results'
import { Err, Ok } from '@/lib/results'

import type { BaseApi } from '../base'
import { EtaDescriptor } from '../EtaDescriptor'
import { KmbEta } from './KmbEta'
import { KmbRoute } from './KmbRoute'
import { KmbStation } from './KmbStation'

export class KmbApi implements BaseApi {
  client: Client
  fetchStopListDelay: number = 24 * 60 * 60
  fetchEtaDelay: number = 20

  constructor() {
    this.client = createClient({
      baseUrl: `${PROXY_URL}/https://data.etabus.gov.hk`,
    })
  }

  async getStations(): Promise<Result<KmbStation[], Error>> {
    const cached = await cache(
      'kmb_stop_list',
      () => kmb.getV1TransportKmbStop({ client: this.client }),
      this.fetchStopListDelay,
    )

    const response = cached.value

    if (!response.data) {
      return Err(new Error('Failed to fetch KMB stop list'))
    }

    const ret: KmbStation[] = []

    for (const stop of response.data.data) {
      ret.push(
        KmbStation({
          id: stop.stop,
          _name: stop.name_tc,
          _lat: Number.parseFloat(stop.lat),
          _lon: Number.parseFloat(stop.long),
        }),
      )
    }

    return Ok(ret)
  }

  async getStopEta(stop: KmbStation): Promise<Result<KmbEta[], Error>> {
    const response
      = await kmb.getV1TransportKmbStopEtaByStopId({
        path: { stop_id: stop.id },
        client: this.client,
      })

    if (!response.data) {
      return Err(new Error('Failed to fetch KMB stop ETA'))
    }

    const hm: HashMap<KmbRoute, KmbEta> = HashMap()

    for (const rawRoute of response.data.data) {
      const route = KmbRoute({
        route: rawRoute.route,
        // serviceType: rawRoute.service_type,
        _dest: rawRoute.dest_tc,
      })

      let eta: EtaDescriptor = EtaDescriptor.Err(new Error('Unknown error'))

      if (rawRoute.eta === null) {
        eta = EtaDescriptor.NoEta
      }
      else {
        const date = new Date(rawRoute.eta)
        const now = new Date()
        const diff = date.getTime() - now.getTime()

        if (diff < 0) {
          eta = EtaDescriptor.JustDeparted
        }
        else {
          const minutes = Math.ceil(diff / 60 / 1000)
          eta = EtaDescriptor.MinutesLeft(minutes)
        }
      }

      let etaList = hm.get(route)

      if (etaList === undefined) {
        etaList = KmbEta({ route, stop })
        hm.set(route, etaList)
      }

      etaList.addEta({ val: eta, rmk: rawRoute.rmk_tc }, rawRoute.eta_seq)
    }

    return Ok(hm.values())
  }

  async getNearbyStops(
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<Result<KmbStation[], Error>> {
    const stopList = await this.getStations()

    if (stopList.isErr())
      return stopList

    const stops = stopList.unwrap().filter((stop) => {
      return stop.distance(
        { latitude, longitude },
      ) <= radius
    })

    return Ok(stops)
  }

  async getNearbyEtas(
    lat: number,
    lon: number,
    radius: number,
  ):
    Promise<Result<KmbEta[], Error>> {
    const stops = await this.getNearbyStops(lat, lon, radius)

    return stops.andThenAwait(async (stops) => {
      const promises = stops.map(async stop => this.getStopEta(stop))
      const ret = await Promise.all(promises)

      return Ok(ret.map(r => r.unwrap()).flat())
    })
  }
}
