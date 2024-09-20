<script setup lang="ts">
import { useIntervalFn, useStorage } from '@vueuse/core'
import { EnumInstanceProto } from 'breath-enum/dist/lib/EnumInstance'
import { formatDate } from 'date-fns'
import { computed, ref } from 'vue'

import EtaFilterInput from '@/components/EtaFilterInput.vue'
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

import type { TEta } from '@/apis/base'
import { getCurrentPosition } from '@/apis/geolocation'
import { KmbApi } from '@/apis/kmb'
import { LrtApi } from '@/apis/lrt'
import { EtaFilter } from '@/lib/EtaFilter'
import { Ok } from '@/lib/results'
import { SetSerializer } from '@/lib/serializers'
import type { Keyed } from '@/lib/traits/Keyed'
import { useSettings } from '@/settings'

const kmb = new KmbApi()
const lrt = new LrtApi()

const searchQuery = useStorage(
  'searchQuery',
  [] as (EtaFilter & Keyed)[],
  localStorage,
  {
    serializer: {
      read: (str: string) => {
        const arr = JSON.parse(str)

        if (!Array.isArray(arr))
          return []

        arr.forEach((item: EtaFilter & Keyed) => {
          Object.setPrototypeOf(item, EnumInstanceProto)
        })

        return arr as (EtaFilter & Keyed)[]
      },
      write: JSON.stringify,
    },
  },
)

const favList = useStorage(
  'favList',
  new Set<string>(),
  localStorage,
  { serializer: SetSerializer },
)

const settings = useSettings()

function evalSearchQuery(entry: Entry): boolean {
  return searchQuery.value.every((q) => {
    return EtaFilter.prototype.evaluate.call(q, entry.entry)
  })
}

interface Entry {
  entry: TEta
  distance: number
  key: string
  isFavourite: boolean
}

const _etaEntries = ref<Record<string, Entry[]>>({})
const etaEntries = computed<Entry[]>(
  () => Object.values(_etaEntries.value).flat(),
)

const computedEtaEntries = computed(() => {
  return etaEntries.value
    .filter(evalSearchQuery)
    .map((entry) => ({
      ...entry,
      precedance: -entry.distance / settings.value.maxDistance
        + (entry.isFavourite ? 1 : 0),
    }))
    .sort((a, b) => b.precedance - a.precedance)
})

const lastUpdate = ref<Date | null>(null)

const lastUpdateStr = computed(() => {
  if (!lastUpdate.value)
    return 'never'

  return formatDate(lastUpdate.value, 'HH:mm:ss')
})

function updateFavourite(key: string, val: boolean) {
  const entry = etaEntries.value.find((e) => e.key === key)

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
  const apis = { kmb, lrt }

  lastUpdate.value = new Date()

  Object.entries(apis).forEach(async ([apiName, api]) => {
    const res = await api.getNearbyEtas(
      pos.coords.latitude,
      pos.coords.longitude,
      settings.value.maxDistance,
    )

    res.andThen((data) => {
      _etaEntries.value[apiName] = data.map((entry) => {
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
      })

      return Ok()
    })
  })
}

useIntervalFn(() => {
  fetchData()
}, 20 * 1000, {
  immediateCallback: true,
})
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
        <EtaFilterInput v-model="searchQuery" />
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
