<script setup lang="ts">
import type { ColorSection } from '../lib/color-catalog'
import RampBar from './RampBar.vue'
import SwatchRow from './SwatchRow.vue'

// One mode column (Light or Dark) of a color section — the Colors page renders
// two of these per section, the dark one wrapped in `.dark` by the page.
defineProps<{ section: ColorSection }>()
</script>

<template>
  <div>
    <SwatchRow
      v-for="token in section.rows ?? []"
      :key="token"
      :token="token"
    />
    <div
      v-if="section.rows?.length && section.ramps?.length"
      class="h-4"
    />
    <RampBar
      v-for="ramp in section.ramps ?? []"
      :key="ramp.prefix"
      :spec="ramp"
    />
  </div>
</template>
