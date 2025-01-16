import { useStorage } from '@vueuse/core'
import { z } from 'zod'

export const settingsSchema = z.object({
  proxyUrl: z.string().url(),
  maxDistance: z.number().int().min(0).max(1000),
})

export type ISettings = z.infer<typeof settingsSchema>

export const defaultSettings: ISettings = {
  proxyUrl: 'http://localhost:8080',
  maxDistance: 500,
}

export function useSettings() {
  return useStorage<ISettings>(
    'smlrt--settings',
    defaultSettings,
    localStorage,
    {
      serializer: {
        read: (v) => {
          if (!v)
            return defaultSettings
          const obj = JSON.parse(v)

          try {
            return settingsSchema.parse(obj)
          }
          catch (e) {
            console.error('Failed to parse settings from storage:', e)
            return defaultSettings
          }
        },
        write: v => JSON.stringify(v),
      },
    },
  )
}
