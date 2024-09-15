import type { Variants } from 'breath-enum'
import { Enum, Type, Unit } from 'breath-enum'

export const EtaDescriptor = Enum({
  MinutesLeft: Type<number>,
  JustDeparted: Unit,
  NoEta: Unit,
  Err: Type<Error>,
})

export type EtaDescriptor = Variants<typeof EtaDescriptor>
