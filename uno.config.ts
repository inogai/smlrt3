import presetIcons from '@unocss/preset-icons/browser'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    presetIcons({
      collections: {
        mdi: () =>
          import('@iconify-json/mdi/icons.json').then(i => i.default),
      },
    }),
  ],
})
