export type Primitive = string | number | symbol | boolean | null

export interface Eq {
  // We use method signature style here to make `this` bivariant
  // eslint-disable-next-line ts/method-signature-style
  equals(other: this): boolean
}

export interface Hashable extends Eq {
  hashSymbol: () => symbol
}
