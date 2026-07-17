<script setup lang="ts">
import type { ComponentSpec, ControlSpec, EnumControl, SpecState } from '../lib/spec'
import { Input } from '#/components/input'
import { NumberField } from '#/components/number-field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from '#/components/select'
import { Switch } from '#/components/switch'
import { tt } from '../lib/i18n'
import RowButton from './RowButton.vue'

const props = defineProps<{
  spec: ComponentSpec
  state: SpecState
  example?: string
}>()

const emit = defineEmits<{
  set: [key: string, value: string | number | boolean]
  selectExample: [name: string]
}>()

// Inapplicable controls render disabled-in-place (opacity-40, the contract's
// disabled treatment) rather than unmounting — the panel layout stays stable
// while toggling a prerequisite like "Loading".
function enabled(c: ControlSpec): boolean {
  return !c.when || c.when(props.state)
}

// ≤5 options → menu-vocabulary radio rows (OptionRows); longer lists → the
// library's own Select (never the OS-native popup).
function enumDisplay(c: EnumControl): 'radio-list' | 'select' {
  return c.display ?? (c.options.length <= 5 ? 'radio-list' : 'select')
}
</script>

<template>
  <aside class="flex w-72 shrink-0 flex-col gap-5 overflow-y-auto border-l border-border p-4">
    <p class="text-body text-muted-foreground">
      {{ tt(spec.description, spec.descriptionZh) }}
    </p>

    <div v-if="spec.examples?.length">
      <div class="mb-1 text-body text-muted-foreground">
        {{ tt('Example', '示例') }}
      </div>
      <div class="flex flex-col gap-0.5">
        <RowButton
          v-for="ex in spec.examples"
          :key="ex.name"
          :active="example === ex.name"
          @select="emit('selectExample', ex.name)"
        >
          {{ tt(ex.name, ex.nameZh) }}
        </RowButton>
      </div>
    </div>

    <div
      v-for="c in spec.controls"
      :key="c.key"
      :class="{ 'pointer-events-none opacity-40': !enabled(c) }"
    >
      <template v-if="c.kind === 'enum' && enumDisplay(c) === 'radio-list'">
        <div class="mb-1 text-body text-muted-foreground">
          {{ c.label }}
        </div>
        <div class="flex flex-col gap-0.5">
          <RowButton
            v-for="opt in c.options"
            :key="opt"
            :active="state[c.key] === opt"
            @select="emit('set', c.key, opt)"
          >
            {{ opt }}
          </RowButton>
        </div>
      </template>

      <div
        v-else
        class="flex items-center justify-between gap-3 py-1"
      >
        <label
          class="text-control"
          :class="enabled(c) ? 'text-foreground' : 'text-muted-foreground'"
        >{{ c.label }}</label>
        <Select
          v-if="c.kind === 'enum'"
          :model-value="String(state[c.key])"
          @update:model-value="emit('set', c.key, String($event))"
        >
          <SelectTrigger
            size="sm"
            class="w-32"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent size="sm">
            <SelectItem
              v-for="opt in c.options"
              :key="opt"
              :value="opt"
            >
              <SelectItemText>{{ opt }}</SelectItemText>
            </SelectItem>
          </SelectContent>
        </Select>
        <Switch
          v-else-if="c.kind === 'boolean'"
          size="sm"
          :model-value="Boolean(state[c.key])"
          @update:model-value="emit('set', c.key, $event)"
        />
        <NumberField
          v-else-if="c.kind === 'number'"
          size="sm"
          class="w-24"
          :min="c.min"
          :max="c.max"
          :model-value="Number(state[c.key])"
          @update:model-value="emit('set', c.key, $event)"
        />
        <Input
          v-else-if="c.kind === 'string'"
          size="sm"
          class="w-32"
          :model-value="String(state[c.key])"
          :placeholder="c.placeholder"
          @update:model-value="emit('set', c.key, String($event))"
        />
      </div>
    </div>
  </aside>
</template>
