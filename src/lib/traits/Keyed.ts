import { v4 as uuidv4 } from 'uuid'

export interface Keyed {
  key: number | string
}

export function ToKeyed<T extends object>(
  target: T,
  key: number | string = uuidv4(),
): T & Keyed {
  return Object.assign(target, { key })
}
