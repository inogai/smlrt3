<script setup lang="ts">
import { isKind } from 'breath-enum'

import type { TEta } from '@/apis/base'
import { EtaDescriptor } from '@/apis/EtaDescriptor'

const { item } = defineProps<{
  item: TEta
}>()

const isFavourite = defineModel<boolean>('isFavourite', {
  required: true,
})

function toggleFavourite() {
  isFavourite.value = !isFavourite.value
}
</script>

<template>
  <div class="flex items-stretch">
    <!-- Favourite button -->
    <div class="flex flex-col justify-center">
      <div
        class="
          flex h-full cursor-pointer flex-col justify-center rounded-l-md p-1
        "
        :class="{
          'bg-primary text-primary-foreground': isFavourite,
        }"
        @click="toggleFavourite"
      >
        {{ isFavourite ? '★' : '☆' }}
      </div>
    </div>
    <div class="w-1" />
    <!-- Route badge -->
    <div class="flex flex-col justify-center">
      <div
        class="
          flex w-12 justify-center rounded-full bg-red-600 text-sm font-semibold
          text-white
        "
      >
        {{ item.route().name() }}
      </div>
    </div>
    <div class="w-2" />
    <!-- Station name and destination -->
    <div class="flex max-w-40 flex-col text-sm">
      <div class="overflow-x-hidden text-ellipsis text-nowrap">
        往
        <span
          class="text-lg font-semibold text-tinted-primary"
        >
          {{ item.route().dest() }}
        </span>
      </div>
      <div class="overflow-x-hidden text-ellipsis text-nowrap">
        {{ item.station().name() }}
      </div>
    </div>
    <div class="w-2 grow" />
    <!-- ETA -->
    <div class="flex flex-col justify-center">
      <div class="flex max-w-28 flex-row flex-nowrap items-baseline">
        <div class="min-w-0 shrink overflow-x-hidden text-ellipsis text-nowrap">
          <span
            v-for="(eta, ind) in item.items()"
            :key="ind"
          >
            <span
              v-if="isKind(eta.val, EtaDescriptor.JustDeparted)" class="text-sm"
            >
              正在離開
            </span>
            <span
              v-else-if="isKind(eta.val, EtaDescriptor.MinutesLeft)"
              :class="{
                'text-xl font-bold text-tinted-primary':
                  (ind === 0 || item.items().slice(0, ind).every(
                    ({ val }) => {
                      return isKind(val, EtaDescriptor.JustDeparted)
                    },
                  )) && isKind(eta.val, EtaDescriptor.MinutesLeft),
              }"
            >
              {{ eta.val.unwrapAs(EtaDescriptor.MinutesLeft) }}
            </span>
            <template v-else-if="isKind(eta.val, EtaDescriptor.NoEta)">
              沒有班次
            </template>
            <template v-if="ind !== item.items().length - 1">,&nbsp;</template>
          </span>
        </div>
        <div
          v-if="isKind (item.items()[item.items().length - 1].val,
                        EtaDescriptor.MinutesLeft)"
        >
          &nbsp;分鐘
        </div>
      </div>
    </div>
  </div>
</template>
