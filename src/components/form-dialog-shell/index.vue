<template>
  <Dialog
    v-model:open="open"
  >
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogContent
      :class="maxWidthClass"
    >
      <form
        @submit.prevent="handleSubmit"
      >
        <DialogHeader>
          <DialogTitle>{{ title }}</DialogTitle>
          <DialogDescription v-show="description">
            {{ description }}
          </DialogDescription>
        </DialogHeader>
        <slot name="body" />
        <DialogFooter class="mt-4">
          <DialogClose as-child>
            <Button
              variant="outline"
            >
              {{ cancelText }}
            </Button>
          </DialogClose>
          <Button
            type="submit"
            :disabled="submitDisabled"
            :loading="loading"
          >
            {{ submitText }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
// Lifted from the host app (apps/web/components/form-dialog-shell/index.vue,
// now a re-export shim) so the form dialog shell has exactly one
// implementation. Library-boundary adaptations vs the host original:
// - the single '@felinic/ui' import split into relative '../button' (Button)
//   and '../dialog' (Dialog*).
// Everything else is byte-identical to the host original.
import { Button } from '../button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog'

withDefaults(defineProps<{
  title: string
  description?: string
  cancelText: string
  submitText: string
  submitDisabled?: boolean
  loading?: boolean
  maxWidthClass?: string
}>(), {
  description: undefined,
  submitDisabled: false,
  loading: false,
  maxWidthClass: 'sm:max-w-106.25',
})

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  submit: []
}>()

function handleSubmit() {
  emit('submit')
}
</script>
