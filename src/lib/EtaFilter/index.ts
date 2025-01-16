import type { TEta } from '@/apis/base'

import { cn } from '../utils'

interface Text { kind: 'Text', value: string }
interface Dest { kind: 'Dest', value: string }
interface Route { kind: 'Route', value: string }
interface Stop { kind: 'Stop', value: string }
interface Co { kind: 'Co', value: string }
interface Not { kind: 'Not', value: EtaFilter }

export type EtaFilter = Text | Dest | Route | Stop | Co | Not

const _EtaFilter = {
  Text: (value: string): Text => ({ kind: 'Text', value }),
  Dest: (value: string): Dest => ({ kind: 'Dest', value }),
  Route: (value: string): Route => ({ kind: 'Route', value }),
  Stop: (value: string): Stop => ({ kind: 'Stop', value }),
  Co: (value: string): Co => ({ kind: 'Co', value }),
  Not: (value: EtaFilter): Not => ({ kind: 'Not', value }),
}

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
      return {
        Text: cn`bg-gray-200`,
        Dest: cn`bg-blue-600 text-white`,
        Route: cn`bg-yellow-600 text-white`,
        Stop: cn`bg-red-600 text-white`,
        Co: cn`bg-purple-500 text-white`,
        Not: cn`bg-gray-700 text-white`,
      }[this.kind]
    },
    evaluate(this: EtaFilter, eta: TEta): boolean {
      switch (this.kind) {
        case 'Text':
          return eta.route().name().includes(this.value)
            || eta.route().dest().includes(this.value)
            || eta.station().name().includes(this.value)
        case 'Dest':
          return eta.route().dest().includes(this.value)
        case 'Route':
          return eta.route().name() === this.value
        case 'Stop':
          return eta.station().name() === this.value
        case 'Co':
          return eta.co() === this.value
        case 'Not':
          return !EtaFilter.prototype.evaluate.call(this.value, eta)
        default:
          throw new Error('Unknown type')
      }
    },
  },
})
