<script setup lang="ts">
import { isKind } from 'breath-enum'

import type { TEta } from '@/apis/base'
import { EtaDescriptor } from '@/apis/EtaDescriptor'

const { item } = defineProps<{
  item: TEta
}>()
</script>

<template>
  <div class="flex items-baseline gap-4">
    <div class="flex grow items-center justify-start">
      <div
        class="
          flex w-12 justify-center rounded-full bg-red-600 text-sm font-semibold
          text-white
        "
      >
        {{ item.route().name() }}
      </div>
      <div class="w-4" />
      <div class="flex flex-col text-sm">
        <div>
          往
          <span class="text-lg font-semibold text-tinted-primary">
            {{ item.route().dest() }}
          </span>
        </div>
        <div>{{ item.station().name() }}</div>
      </div>
    </div>
    <div class="flex items-end justify-end text-muted-foreground">
      <div>
        <span
          v-for="(eta, ind) in item.items()"
          :key="ind"
          :class="{
            'text-xl font-bold text-tinted-primary':
              (ind === 0 || item.items().slice(0, ind).every(
                ({ val }) => {
                  return isKind(val, EtaDescriptor.JustDeparted)
                },
              )) && isKind(eta.val, EtaDescriptor.MinutesLeft),
          }"
        >
          <span
            v-if="isKind(eta.val, EtaDescriptor.JustDeparted)" class="text-sm"
          >
            正在離開</span>
          <template v-else-if="isKind(eta.val, EtaDescriptor.MinutesLeft)">
            {{ eta.val.unwrapAs(EtaDescriptor.MinutesLeft) }}
          </template>
          <template v-else-if="isKind(eta.val, EtaDescriptor.NoEta)">
            沒有班次
          </template>
          <template v-if="ind !== item.items().length - 1">,&nbsp;</template>
        </span>
        <span
          v-if="isKind (item.items()[item.items().length - 1].val,
                        EtaDescriptor.MinutesLeft)"
        >
          分鐘
        </span>
      </div>
    </div>
  </div>
</template>
