import { mktu, type TaggedUnion } from 'mktu'

import type { TEta } from '@/apis/base'

import { cn } from '../utils'

export type EtaFilter = TaggedUnion<{
  Text: string
  Dest: string
  Route: string
  Stop: string
  Co: string
  Not: EtaFilter
}>

const _EtaFilter = mktu<EtaFilter>()

export const EtaFilter = Object.assign(_EtaFilter, {
  parse: (queryString: string): EtaFilter => {
    if (queryString.startsWith('!'))
      return EtaFilter.Not(EtaFilter.parse(queryString.slice(1)))

    if (!queryString.includes(':'))
      return EtaFilter.Text(queryString)

    const [rule, val] = queryString.split(':')

    switch (rule) {
      case 'dest': return EtaFilter.Dest(val)
      case 'route': return EtaFilter.Route(val)
      case 'stop': return EtaFilter.Stop(val)
      case 'co': return EtaFilter.Co(val)
      default: {
        console.error(`Unknown rule: ${rule}`)
        return EtaFilter.Text(queryString)
      }
    }
  },

  prototype: {
    colorClass(this: EtaFilter): string {
      return EtaFilter.match(this, {
        Text: () => cn`bg-gray-200`,
        Dest: () => cn`bg-blue-600 text-white`,
        Route: () => cn`bg-yellow-600 text-white`,
        Stop: () => cn`bg-red-600 text-white`,
        Co: () => cn`bg-purple-500 text-white`,
        Not: () => cn`bg-gray-700 text-white`,
      })
    },
    evaluate(this: EtaFilter, eta: TEta): boolean {
      return EtaFilter.match(this, {
        Text: (val) => {
          return eta.route().name().includes(val)
            || eta.route().dest().includes(val)
            || eta.station().name().includes(val)
        },
        Dest: (val) => eta.route().dest().includes(val),
        Route: (val) => eta.route().name() === val,
        Stop: (val) => eta.station().name() === val,
        Co: (val) => eta.co() === val,
        Not: (val) => !EtaFilter.prototype.evaluate.call(val, eta),
      })
    },
  },
})
