<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { computed, ref } from 'vue'

import EtaItem from '@/components/EtaItem.vue'
import SettingsDialog from '@/components/SettingsDialog.vue'
import { Badge } from '@/components/ui/badge'
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
import { LrtApi } from '@/apis/lrt'
import { Ok } from '@/lib/results'
import { SetSerializer } from '@/lib/serializers'
import { useSettings } from '@/settings'

const kmb = new KmbApi()
const lrt = new LrtApi()

const searchQuery = ref<string[]>([])

const favList = useStorage(
  'favList',
  new Set<string>(),
  localStorage,
  SetSerializer,
)

const settings = useSettings()

function evalSearchQuery(entry: Entry): boolean {
  return searchQuery.value.every((q) => {
    return entry.entry.route().name().includes(q)
      || entry.entry.route().dest().includes(q)
      || entry.entry.station().name().includes(q)
      || favList.value.has(entry.key)
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
      precedance: -entry.distance / settings.value.maxDistance
        + (entry.isFavourite ? 1 : 0),
    }))
    .sort((a, b) => b.precedance - a.precedance)
})

const lastUpdate = ref<Date | null>(null)

const lastUpdateStr = computed(() => {
  return lastUpdate.value
    ? `${formatDistanceToNow(lastUpdate.value)} ago`
    : 'Never'
})

function updateFavourite(key: string, val: boolean) {
  const entry = etaEntries.value.find(e => e.key === key)

  if (entry)
    entry.isFavourite = val

  if (val) {
    favList.value.add(key)
  }
  else {
    favList.value.delete(key)
  }
}

async function fetchData() {
  const pos = await getCurrentPosition()
  const apis = [kmb, lrt]

  lastUpdate.value = new Date()

  apis.map(api => api.getNearbyEtas(
    pos.coords.latitude,
    pos.coords.longitude,
    settings.value.maxDistance,
  )).forEach(async (res) => {
    (await res).andThen((data) => {
      etaEntries.value.push(...data.map((entry) => {
        const key = entry.route().name()
          + entry.route().dest()
          + entry.station().name()

        return {
          entry,
          distance: entry.station().distance({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          }),
          key,
          isFavourite: favList.value.has(key),
        }
      }))

      return Ok()
    })
  })
}

fetchData()
</script>

<template>
  <div
    class="
      flex flex-col gap-6
      md:p-6
    "
  >
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
          <div class="flex items-center gap-2">
            即時到站時間
            <Badge>Total: {{ computedEtaEntries.length }} </Badge>
            <Badge class="bg-secondary text-secondary-foreground">
              Last Updated: {{ lastUpdateStr }}
            </Badge>
            <SettingsDialog />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent class="px-2">
        <TransitionGroup name="list">
          <div
            v-for="entry in computedEtaEntries"
            :key="entry.key"
            class="bg-card"
          >
            <Separator />
            <div class="p-2">
              <EtaItem
                :is-favourite="entry.isFavourite"
                :item="entry.entry"
                @update:is-favourite="val => updateFavourite(entry.key, val)"
              />
            </div>
          </div>
        </TransitionGroup>
      </CardContent>
    </Card>
  </div>
</template>

<style>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease-in-out;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  max-height: 0;
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
