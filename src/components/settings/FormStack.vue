<template>
  <!-- Vertical rhythm for a run of FieldStacks. space-y-4 is the field→field gap
       in the house form; keeping it in one wrapper stops each caller re-deriving
       the value and lets the gap change in one place.
       Lifted from the host app's settings owner vocabulary
       (apps/web/components/settings/form-stack.vue, now a re-export shim);
       byte-identical to the host original (no adaptations needed). -->
  <div class="space-y-4">
    <slot />
  </div>
</template>
