<script setup lang="ts">
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
} from '@/components/ui/tags-input'

import { EtaFilter } from '@/lib/EtaFilter'
import type { Keyed } from '@/lib/traits/Keyed'
import { ToKeyed } from '@/lib/traits/Keyed'

const searchQuery = defineModel<(EtaFilter & Keyed)[]>({
  required: true,
})
</script>

<template>
  <TagsInput
    v-model="searchQuery"
    :convert-value="str => ToKeyed(EtaFilter.parse(str))"
    :display-value="() => ''"
  >
    <TagsInputItem
      v-for="item in searchQuery"
      :key="item.key"
      class="px-0.5"
      :class="EtaFilter.prototype.colorClass.call(item)"
      :value="item"
      as-child
    >
      <div class="flex">
        <div class="px-1 font-semibold">
          {{ item.kind.toUpperCase() }}
        </div>
        <div class="w-0.5" />
        <div
          class="
            flex items-center rounded-r-[calc(var(--radius)-6px)] bg-secondary
            pl-1.5 text-secondary-foreground
          "
        >
          <div>
            {{ item.value }}
          </div>
          <div class="w-1" />
          <TagsInputItemDelete />
        </div>
      </div>
    </TagsInputItem>

    <TagsInputInput placeholder="Type then press Enter to filter..." />
  </TagsInput>
</template>
