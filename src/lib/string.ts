export function splitCamelCase(str: string): string[] {
  const ret = []

  let wordBegin = 0
  for (let i = 0; i < str.length; i++) {
    const lower = str[i].toLowerCase()

    if (lower !== str[i]) {
      const word = str.slice(wordBegin, i - 1).toLowerCase()
      ret.push(word)
      wordBegin = i
    }
  }
  ret.push(str.slice(wordBegin).toLowerCase())

  return ret
}

export function toTitleCase(words: string[]): string {
  return words.map((word) => word[0].toUpperCase() + word.slice(1)).join(' ')
}
