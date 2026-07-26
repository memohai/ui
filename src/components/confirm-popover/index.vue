<script setup lang="ts">
import { Button } from '../button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../popover'

// ConfirmPopover — the anchored confirm bubble: the shared popover chrome,
// a title-grade question, optional supporting line, ghost cancel + action
// confirm. Lifted from the host (apps/web/components/confirm-popover, now a
// re-export shim); all copy arrives via props (the library holds no i18n).
// Token adaptation only: text-sm→text-control, text-xs→text-body.
withDefaults(defineProps<{
  title?: string
  message?: string
  /** 确认键文案(caller i18n)。 */
  confirmText: string
  /** 取消键文案(caller i18n,通常 common.cancel)。 */
  cancelText: string
  loading?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}>(), {
  title: '',
  message: '',
  loading: false,
  variant: 'default',
})

defineEmits<{
  confirm: []
}>()
</script>

<template>
  <Popover>
    <template #default="{ close }">
      <PopoverTrigger as-child>
        <slot name="trigger" />
      </PopoverTrigger>
      <!-- Inherit the shared popover chrome (menu-shell radius, --border-menu
           hairline, dropdown shadow, p-4) instead of overriding it — this is the
           same surface as DropdownMenu / Select, so a confirm reads as part of
           the one menu language. This is an anchored popover, NOT a modal dialog:
           keep it compact (the question is allowed to wrap to ~2 lines) and keep
           the inherited p-4 edge inset so text never touches the border. -->
      <PopoverContent class="w-72 max-w-[calc(100vw-2rem)]">
        <div class="space-y-3">
          <!-- The core question is the strongest line in a confirm: it reads as a
               title (text-control / medium / foreground), never as muted caption
               text. With only a message, the message *is* the question; pass a
               title too and the message drops to the supporting line beneath it. -->
          <div class="flex items-start gap-2">
            <span
              v-if="$slots.icon"
              class="mt-0.5 shrink-0"
            >
              <slot name="icon" />
            </span>
            <p class="min-w-0 text-control font-medium text-foreground">
              <template v-if="title">
                {{ title }}
              </template>
              <slot v-else>
                {{ message }}
              </slot>
            </p>
          </div>

          <p
            v-if="title && (message || !!$slots.default)"
            class="text-body leading-relaxed text-muted-foreground"
          >
            <slot>{{ message }}</slot>
          </p>

          <div class="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              @click="close"
            >
              {{ cancelText }}
            </Button>
            <Button
              type="button"
              size="sm"
              :variant="variant"
              :loading="loading"
              @click="$emit('confirm'); close()"
            >
              {{ confirmText }}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </template>
  </Popover>
</template>
