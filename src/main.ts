import '@/assets/index.css'

import VWave from 'v-wave'
import { createApp } from 'vue'

import App from './App.vue'

createApp(App)
  .use(VWave, {})
  .mount('#app')
