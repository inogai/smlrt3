import type { Variants } from 'breath-enum'
import { Enum, match, Type as $ } from 'breath-enum'

import type { TEta } from '@/apis/base'

const _EtaFilter = Enum({
  Text: $<string>,
  Dest: $<string>,
  Route: $<string>,
  Stop: $<string>,
  Co: $<string>,
  Not: $<any>,
})

export type EtaFilter = Variants<typeof _EtaFilter>

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
    evaluate(this: EtaFilter, eta: TEta): boolean {
      return match(this)({
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
