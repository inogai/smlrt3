<script setup lang="ts">
import { RouterView } from 'vue-router'

import { Toaster } from '@/components/ui/toast'
</script>

<template>
  <Toaster />
  <RouterView />
</template>
