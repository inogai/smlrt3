<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'

import { AutoForm } from '@/components/ui/auto-form'
import { useToast } from '@/components/ui/toast'

import type { ISettings } from '@/settings'
import { settingsSchema, useSettings } from '@/settings'

defineEmits(['submit'])

const { toast } = useToast()

const triggerSubmit = defineModel<boolean>('triggerSubmit')

triggerSubmit.value = false

watch(triggerSubmit, (value) => {
  if (!value)
    return

  submit()
  triggerSubmit.value = false
})

const settings = useSettings()

const form = useForm({
  validationSchema: toTypedSchema(settingsSchema),
})

const virtualSubmit = ref<HTMLButtonElement | null>(null)

function submit() {
  if (!virtualSubmit.value)
    return

  virtualSubmit.value.click()
}

function onSubmit(values: Record<string, unknown>) {
  settings.value = values as ISettings

  toast({
    title: 'Settings updated',
    variant: 'default',
  })
}
</script>

<template>
  <AutoForm
    :schema="settingsSchema"
    :form="form"
    class="space-y-6"
    @submit="onSubmit"
  >
    <button ref="virtualSubmit" type="submit" />
  </AutoForm>
</template>
