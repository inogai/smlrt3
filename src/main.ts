import '@/assets/index.css'
import 'virtual:uno.css'

import VWave from 'v-wave'
import { createApp } from 'vue'

import App from '@/App.vue'

import { router } from '@/routes'

createApp(App)
  .use(VWave, {})
  .use(router)
  .mount('#app')
