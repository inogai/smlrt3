<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  ComboboxInput,
  ComboboxTrigger,
  PopoverAnchor,
} from 'radix-vue'

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
} from '@/components/ui/popover'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
} from '@/components/ui/tags-input'

import type { TEta } from '@/apis/base'
import { EtaFilter } from '@/lib/EtaFilter'
import { splitCamelCase, toTitleCase } from '@/lib/string'
import type { Keyed } from '@/lib/traits/Keyed'
import { ToKeyed } from '@/lib/traits/Keyed'

import { Badge } from './ui/badge'

interface Entry { entry: TEta }

const props = defineProps<{
  etaEntries: Entry[]
}>()

const searchQuery = defineModel<(EtaFilter & Keyed)[]>({
  required: true,
})

const dropdownOpen = ref(false)

const inputText = ref('')

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

interface SuggestionItem {
  value: string
  badges?: string[]
  desc?: string
  action?: 'accept' | 'compose'
}

const suggestions = computed(() => {
  const ret = {} as Record<string, SuggestionItem[]>

  if (!(inputText.value.includes(':'))) {
    ret['Category'] = [
      { value: 'stop:', desc: 'Search stop name' },
      { value: 'route:', desc: 'Search route name' },
      { value: 'dest:', desc: 'Search destination terminal' },
      { value: 'co:', badges: ['KMB'], desc: 'Search services' },
    ]
  }

  for (const [kind, cb] of Object.entries({
    stop: (entry: Entry) => entry.entry.station().name(),
    route: (entry: Entry) => entry.entry.route().name(),
    dest: (entry: Entry) => entry.entry.route().dest(),
    co: (entry: Entry) => entry.entry.co(),
  })) {
    if (inputText.value.startsWith(`${kind}:`)) {
      ret[
        toTitleCase(splitCamelCase(kind))
      ] = unique(props.etaEntries
        .map(cb))
        .filter((value) => value.includes(inputText.value.slice(
          kind.length + 1,
        )))
        .map((value) => ({
          value: `${kind}:${value}`,
          action: 'compose',
          desc: 'Compose filter',
        }))
    }
  }

  return ret
})

const inputEl = ref<HTMLInputElement | null>(null)
const popoverContentEl = ref<HTMLElement | null>(null)

function handleCommandItem(item: SuggestionItem) {
  switch (item.action) {
    case 'compose':
      handleCommandItemCompose(item)
      break

    case 'accept':
    default:
      handleCommandItemAccept(item)
  }
}

function handleCommandItemAccept(item: SuggestionItem) {
  inputText.value = item.value

  if (inputEl.value) {
    inputEl.value.focus()
  }
}

function handleCommandItemCompose(item: SuggestionItem) {
  searchQuery.value.push(ToKeyed(EtaFilter.parse(item.value)))
  inputText.value = ''

  if (inputEl.value) {
    inputEl.value.focus()
  }
}

function handleBlur(ev: FocusEvent) {
  if (!ev.relatedTarget || !popoverContentEl.value) {
    dropdownOpen.value = false
    return
  }

  if (popoverContentEl.value.contains
    && !popoverContentEl.value.contains(ev.relatedTarget as Node)) {
    dropdownOpen.value = false
  }
}
</script>

<template>
  <Popover :open="dropdownOpen">
    <Command>
      <PopoverAnchor as-child>
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
                  flex items-center rounded-r-[calc(var(--radius)-6px)]
                  bg-secondary pl-1.5 text-secondary-foreground
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

          <ComboboxInput class="grow" as-child>
            <TagsInputInput
              placeholder="Type then press Enter to filter..."
              as-child
            >
              <input
                ref="inputEl"
                :value="inputText"
                @input="ev => inputText = (
                  ev.target as HTMLInputElement | null
                )?.value ?? ''"
                @focus="dropdownOpen = true"
                @blur="handleBlur"
              >
            </TagsInputInput>
          </ComboboxInput>
        </TagsInput>
      </PopoverAnchor>

      <PopoverContent
        ref="popoverContentEl"
        class="w-[--radix-popper-anchor-width] px-2 py-0"
        @blur="handleBlur"
      >
        <CommandList>
          <CommandEmpty>No suggestion.</CommandEmpty>
          <CommandGroup
            v-for="(group, groupTitle) in suggestions"
            :key="groupTitle"
            :heading="groupTitle"
          >
            <CommandItem
              v-for="item in group"
              :key="item.value"
              :value="item.value"
              class="flex items-center"
              @click.prevent="handleCommandItem(item)"
            >
              <div> {{ item.value }}</div>
              <div class="w-4" />
              <div v-if="item.badges" class="flex gap-x-2">
                <Badge
                  v-for="shadow in item.badges"
                  :key="shadow"
                  class="
                    bg-muted text-muted-foreground
                    hover:bg-secondary/50
                  "
                >
                  {{ shadow }}
                </Badge>
              </div>
              <div class="w-1 grow" />
              <div class="text-muted-foreground">
                {{ item.desc }}
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </PopoverContent>
    </Command>
  </Popover>
</template>
