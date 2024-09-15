export class UnwrapError extends Error {}

interface IOk<T> {
  val: T
}

interface IErr<E> {
  msg: E
}

export type ResultPromise<T, E> = Promise<Result<T, E>>

export interface Ok<T> {
  isOk: () => this is Ok<T>
  isErr: () => this is Err<unknown>

  unwrap: () => T

  andThen: <U, E>(fn: (val: T) => Result<U, E>) => Result<U, E>
  andThenAwait: <U, E>(
    fn: (val: T) => ResultPromise<U, E>
  ) => ResultPromise<U, E>

}

export interface Err<E> {
  isOk: () => this is Ok<unknown>
  isErr: () => this is Err<E>

  unwrap: () => never

  andThen: <T>(fn: (val: T) => Result<any, any>) => Err<T>
  andThenAwait: <T>(fn: (val: T) => ResultPromise<any, any>) => Promise<Err<T>>
}

const okPrototype = {
  isOk<T>(): this is Ok<T> {
    return true
  },
  isErr(): this is Err<unknown> {
    return false
  },
  unwrap<T>(this: IOk<T>): T {
    return this.val
  },
  andThen<T, U, E>(this: IOk<T>, fn: (val: T) => Result<U, E>): Result<U, E> {
    return fn(this.val)
  },
  andThenAwait<T, U, E>(
    this: IOk<T>,
    fn: (val: T) => ResultPromise<U, E>,
  ): ResultPromise<U, E> {
    return fn(this.val)
  },
} as const

const errPrototype = {
  isOk(): this is Ok<unknown> {
    return false
  },
  isErr<E>(): this is Err<E> {
    return true
  },
  unwrap<E>(this: IErr<E>): never {
    throw new UnwrapError(JSON.stringify(this.msg))
  },
  andThen<T>(
    this: IErr<T> & Err<T>,
    _fn: (val: T) => Result<any, any>,
  ): Err<T> {
    return this
  },
  andThenAwait<T>(
    this: IErr<T> & Err<T>,
    _fn: (val: T) => ResultPromise<any, any>,
  ): Promise<Err<T>> {
    return Promise.resolve(this)
  },
} as const

export function Ok(): Ok<null>
export function Ok<T>(val: T): Ok<T>

export function Ok<T>(val?: T): Ok<T | null> {
  if (val === undefined) {
    return Ok(null)
  }

  const ret = { val }

  Object.setPrototypeOf(ret, okPrototype)

  return ret as { val: T } & typeof okPrototype
}

export function Err<E>(msg: E): Err<E> {
  const ret = { msg }

  Object.setPrototypeOf(ret, errPrototype)

  return ret as { msg: E } & typeof errPrototype
}

type _Result<T, E> = Ok<T> | Err<E>

export type Result<T, E> = Omit<_Result<T, E>, 'andThen' | 'andThenAwait'> & {
  andThen: <U, F>(fn: (val: T) => Result<U, F>) => Result<U, E | F>
  andThenAwait: <U, F>(
    fn: (val: T) => ResultPromise<U, F>
  ) => ResultPromise<U, E | F>
}
