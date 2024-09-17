import { createRouter, createWebHashHistory } from 'vue-router'

export const RouteName = {
  HOME: 'home',
  SETTINGS: 'settings',
}

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteName.HOME,
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/settings',
      name: RouteName.SETTINGS,
      component: () => import('@/views/SettingsView.vue'),
    },
  ],
})
