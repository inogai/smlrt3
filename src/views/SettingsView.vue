<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import type { ISettings } from '@/settings'
import { settingsSchema, useSettings } from '@/settings'

const settings = useSettings()

const form = useForm({
  validationSchema: toTypedSchema(settingsSchema),
})

function onSubmit(values: Record<string, unknown>) {
  settings.value = values as ISettings
}
</script>

<template>
  <Card>
    <CardContent>
      <AutoForm
        :schema="settingsSchema"
        :form="form"
        class="space-y-6"
        @submit="onSubmit"
      >
        <Button type="submit">
          Apply
        </Button>
      </AutoForm>
    </CardContent>
  </Card>
</template>
