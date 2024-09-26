import type { TaggedUnion } from 'mktu'
import { mktu } from 'mktu'

export type EtaDescriptor = TaggedUnion<{
  MinutesLeft: number
  JustDeparted: null
  NoEta: null
  Err: Error
}>

export const EtaDescriptor = mktu<EtaDescriptor>()
