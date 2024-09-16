import { Ok, type Result } from '@/lib/results'

import { LrtStation } from './LrtStation'

export async function getStations(): Promise<Result<LrtStation[], Error>> {
  const resp = await import('@/assets/lrtStopList.json')

  const ret: LrtStation[] = []
  for (const stop of resp.default) {
    ret.push(
      LrtStation({
        id: stop.id,
        _name: stop.name_tc,
        _lat: stop.lat,
        _lon: stop.lon,
      }),
    )
  }
  return Ok(ret)
}
