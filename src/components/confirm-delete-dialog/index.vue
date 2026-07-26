<script setup lang="ts">
import { Button } from '../button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../dialog'

// ConfirmDeleteDialog — the ONE delete-confirm dialog: a compact
// sm:max-w-sm Dialog, description in DialogDescription, cancel disabled
// while the request is in flight. Lifted from the host
// (apps/web/components/confirm-delete-dialog, now a re-export shim); all
// copy arrives via props (the library holds no i18n).
defineProps<{
  open: boolean
  title: string
  description?: string
  /** 取消键文案(caller i18n,通常 common.cancel)。 */
  cancelLabel: string
  /** 确认键文案(caller i18n,如 common.confirm 或更具体的「删除」)。 */
  confirmLabel: string
  /** 删除请求进行中:确认键转 spinner,取消键禁用。 */
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()
</script>

<template>
  <Dialog
    :open="open"
    @update:open="(value) => emit('update:open', value)"
  >
    <DialogContent class="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription v-if="description">
          {{ description }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          :disabled="loading"
          @click="emit('update:open', false)"
        >
          {{ cancelLabel }}
        </Button>
        <Button
          variant="destructive"
          :loading="loading"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
