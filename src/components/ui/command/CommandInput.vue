<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'

import {
  ComboboxInput,
  type ComboboxInputProps,
  useForwardProps,
} from 'radix-vue'

import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<ComboboxInputProps & {
  class?: HTMLAttributes['class']
}>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <ComboboxInput
    v-bind="{ ...forwardedProps, ...$attrs }"
    auto-focus
    :class="cn(`
      flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none
      disabled:cursor-not-allowed disabled:opacity-50
      placeholder:text-muted-foreground
    `, props.class)"
  >
    <slot />
  </ComboboxInput>
</template>
