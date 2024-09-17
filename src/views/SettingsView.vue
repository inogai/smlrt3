<script setup lang="ts">
import { ref } from 'vue'

import SettingsForm from '@/components/SettingsForm.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const triggerSubmit = ref(false)

function submit() {
  triggerSubmit.value = true
}
</script>

<template>
  <Card>
    <CardContent>
      <SettingsForm v-model:trigger-submit="triggerSubmit" />
    </CardContent>
    <Button @click="submit()">
      Apply
    </Button>
  </Card>
</template>
