interface MinutesLeft { kind: 'MinutesLeft', value: number }
interface JustDeparted { kind: 'JustDeparted', value: null }
interface NoEta { kind: 'NoEta', value: null }
interface Err { kind: 'Err', value: Error }

export type EtaDescriptor =
  | MinutesLeft
  | JustDeparted
  | NoEta
  | Err

export const EtaDescriptor = {
  MinutesLeft: (value: number): MinutesLeft => ({ kind: 'MinutesLeft', value }),
  JustDeparted: (): JustDeparted => ({ kind: 'JustDeparted', value: null }),
  NoEta: (): NoEta => ({ kind: 'NoEta', value: null }),
  Err: (value: Error): Err => ({ kind: 'Err', value }),
}
