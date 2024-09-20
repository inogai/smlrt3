export const SetSerializer = {
  read: (val: any): Set<string> => {
    try {
      const arr = val.split(',')
      if (arr.length === 1 && arr[0] === '')
        return new Set()

      return new Set(arr)
    }
    catch {
      return new Set()
    }
  },
  write: (val: Set<string>): string => {
    return Array.from(val).join(',')
  },
}
