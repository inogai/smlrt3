<script setup lang="ts">
import { ref } from 'vue'

import SettingsForm from '@/components/SettingsForm.vue'
import Button from '@/components/ui/button/Button.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const triggerSubmit = ref(false)

function submit() {
  triggerSubmit.value = true
}

const open = ref(false)

function close() {
  open.value = false
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger>
      Settings
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>

        <DialogDescription>
          <div class="text-left">
            <SettingsForm :trigger-submit="triggerSubmit" />
          </div>
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <div class="flex justify-end space-x-2">
          <Button type="submit" @click="submit(); close()">
            Apply and Close
          </Button>

          <Button type="submit" @click="submit()">
            Apply
          </Button>

          <Button type="reset" variant="destructive" @click="close()">
            Close
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
