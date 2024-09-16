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
import { MAX_DISTANCE } from '@/env'
import { Ok } from '@/lib/results'

const kmb = new KmbApi()

const searchQuery = ref<string[]>([])

function evalSearchQuery(entry: Entry): boolean {
  return searchQuery.value.every((q) => {
    return entry.entry.route().name().includes(q)
      || entry.entry.route().dest().includes(q)
      || entry.entry.station().name().includes(q)
  })
}

interface Entry {
  entry: TEta
  distance: number
  key: string
  isFavourite: boolean
}

const etaEntries = ref<Entry[]>([])

const computedEtaEntries = computed(() => {
  return etaEntries.value
    .filter(evalSearchQuery)
    .map(entry => ({
      ...entry,
      precedance: MAX_DISTANCE - entry.distance
        + (entry.isFavourite ? 1 : 0),
    }))
    .sort((a, b) => b.precedance - a.precedance)
})

async function fetchData() {
  const pos = await getCurrentPosition()
  const res = await kmb.getNearbyEtas(pos.coords.latitude, pos.coords.longitude)

  res.andThen((data) => {
    etaEntries.value.push(...data.map((entry) => {
      return {
        entry,
        distance: entry.station().distance({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
        key: entry.route().name()
          + entry.route().dest()
          + entry.station().name(),
        isFavourite: false,
      }
    }))

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
          v-for="entry in computedEtaEntries"
          :key="entry.key"
        >
          <Separator />
          <div class="p-2">
            <EtaItem
              :is-favourite="entry.isFavourite"
              :item="entry.entry"
              @update:is-favourite="val => {
                etaEntries.find((e) => e.key === entry.key)!.isFavourite = val
              }"
            />
          </div>
        </template>
      </CardContent>
    </Card>
  </div>
</template>
