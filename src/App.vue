<script setup lang="ts">
import { ref } from 'vue'

import EtaItem from '@/components/EtaItem.vue'

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
  <div>
    <template
      v-for="(item, index) in etaEntries"
      :key="index"
    >
      <EtaItem :item="item" />
    </template>
  </div>
</template>
