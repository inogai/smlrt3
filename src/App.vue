<script setup lang="ts">
import { computed, ref } from 'vue'

import EtaItem from '@/components/EtaItem.vue'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input'

import type { TEta } from '@/apis/base'
import { getCurrentPosition } from '@/apis/geolocation'
import { KmbApi } from '@/apis/kmb'
import { Ok } from '@/lib/results'

const kmb = new KmbApi()

const searchQuery = ref<string[]>([])

function evalSearchQuery(entry: TEta): boolean {
  return searchQuery.value.every((q) => {
    return entry.route().name().includes(q)
      || entry.route().dest().includes(q)
      || entry.station().name().includes(q)
  })
}

const etaEntries = ref<TEta[]>([])

const computedEtaEntries = computed(() => {
  return etaEntries.value.filter(evalSearchQuery)
})

async function fetchData() {
  const pos = await getCurrentPosition()
  const res = await kmb.getNearbyEtas(pos.coords.latitude, pos.coords.longitude)

  res.andThen((data) => {
    etaEntries.value.push(...data)
    return Ok()
  })
}

fetchData()
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <Card>
      <CardContent class="pt-6">
        <TagsInput v-model="searchQuery">
          <TagsInputItem v-for="item in searchQuery" :key="item" :value="item">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>

          <TagsInputInput placeholder="Type then press Enter to filter..." />
        </TagsInput>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>
          即時到站時間
        </CardTitle>
      </CardHeader>
      <CardContent>
        <template
          v-for="(item, index) in computedEtaEntries"
          :key="index"
        >
          <Separator />
          <div class="p-2">
            <EtaItem :item="item" />
          </div>
        </template>
      </CardContent>
    </Card>
  </div>
</template>
