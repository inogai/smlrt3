<script setup lang="ts">
import { ref } from 'vue'

import EtaItem from '@/components/EtaItem.vue'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import type { TEta } from '@/apis/base'
import { getCurrentPosition } from '@/apis/geolocation'
import { KmbApi } from '@/apis/kmb'
import { Ok } from '@/lib/results'

const kmb = new KmbApi()

const etaEntries = ref<TEta[]>([])

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
  <div class="container mt-8">
    <Card>
      <CardHeader>
        <CardTitle>
          即時到站時間
        </CardTitle>
      </CardHeader>
      <CardContent>
        <template
          v-for="(item, index) in etaEntries"
          :key="index"
        >
          <div :class="{ 'border-t': index }" />
          <div class="p-2">
            <EtaItem :item="item" />
          </div>
        </template>
      </CardContent>
    </Card>
  </div>
</template>
