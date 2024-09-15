export function attachPrototype<
  T,
  O extends object,
>(obj: T, prototype: O): T & O {
  Object.setPrototypeOf(obj, prototype)
  return obj as T & O
}
