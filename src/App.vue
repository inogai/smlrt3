<script setup lang="ts">
import type { TEta } from '@/apis/base'
import { getCurrentPosition } from '@/apis/geolocation'
import { KmbApi } from '@/apis/kmb'
import { Button } from '@/components/ui/button'
import { Ok } from '@/lib/results'

const kmb = new KmbApi()

const etaEntries: TEta[] = []

async function fetchData() {
  const pos = await getCurrentPosition()
  const res = await kmb.getNearbyEtas(pos.coords.latitude, pos.coords.longitude)

  res.andThen((data) => {
    etaEntries.push(...data)
    return Ok()
  })
}
fetchData()
</script>

<template>
  <Button variant="destructive">
    Click Me
  </Button>
</template>
