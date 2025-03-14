import { type Client, createClient } from '@hey-api/client-fetch'

import * as lrt from '@/clients/lrt'
import { HashMap } from '@/lib/HashMap'
import type { Result } from '@/lib/results'
import { Err, Ok } from '@/lib/results'

import type { BaseApi } from '../base'
import { EtaDescriptor } from '../EtaDescriptor'
import { LrtEta } from './LrtEta'
import { LrtRoute } from './LrtRoute'
import type { LrtStation } from './LrtStation'
import { getStations } from './stopList'

export class LrtApi implements BaseApi {
  client: Client
  fetchStopListDelay: number = 24 * 60 * 60
  fetchEtaDelay: number = 20

  constructor({ proxyUrl }: { proxyUrl: string }) {
    this.client = createClient({
      baseUrl: `${proxyUrl}/http://rt.data.gov.hk`,
    })
  }

  async getStations(): Promise<Result<LrtStation[], Error>> {
    return getStations()
  }

  async getStopEta(stop: LrtStation): Promise<Result<LrtEta[], Error>> {
    const response
      = await lrt.getV1TransportMtrLrtGetSchedule({
        query: { station_id: stop.id },
        client: this.client,
      })

    if (!response.data) {
      return Err(new Error('Failed to fetch KMB stop ETA'))
    }

    const hm: HashMap<LrtRoute, LrtEta> = HashMap()

    for (const rawPlatform of response.data.platform_list) {
      for (const rawRoute of rawPlatform.route_list) {
        const route = LrtRoute({
          route: rawRoute.route_no,
          _dest: rawRoute.dest_ch,
        })

        let eta: EtaDescriptor = EtaDescriptor.Err(new Error('Unknown error'))

        if (rawRoute.time_ch === null) {
          eta = EtaDescriptor.NoEta()
        }
        else {
          if (rawRoute.time_ch === '-') {
            eta = EtaDescriptor.JustDeparted()
          }
          else if (rawRoute.time_ch === '即將抵達') {
            eta = EtaDescriptor.MinutesLeft(0)
          }
          else {
            try {
              const etaMinutes = Number.parseInt(rawRoute.time_ch, 10)
              eta = EtaDescriptor.MinutesLeft(etaMinutes)
            }
            catch (e) {
              console.error(e)
            }
          }
        }

        let etaList = hm.get(route)

        if (etaList === undefined) {
          etaList = LrtEta({ route, stop })
          hm.set(route, etaList)
        }

        etaList.addEta({ val: eta, trainLength: rawRoute.train_length })
      }
    }

    return Ok(hm.values())
  }

  async getNearbyStops(
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<Result<LrtStation[], Error>> {
    const stopList = await this.getStations()

    if (stopList.isErr())
      return stopList

    const stops = stopList.unwrap().filter((stop) => {
      return stop.distance({ latitude, longitude }) <= radius
    })

    return Ok(stops)
  }

  async getNearbyEtas(
    lat: number,
    lon: number,
    radius: number,
  ):
    Promise<Result<LrtEta[], Error>> {
    const stops = await this.getNearbyStops(lat, lon, radius)

    return stops.andThenAwait(async (stops) => {
      const promises = stops.map(async stop => this.getStopEta(stop))
      const ret = await Promise.all(promises)

      return Ok(ret.map(r => r.unwrap()).flat())
    })
  }
}
