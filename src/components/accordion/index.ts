export { default as Accordion } from './Accordion.vue'
export { default as AccordionContent } from './AccordionContent.vue'
export { default as AccordionItem } from './AccordionItem.vue'
export { default as AccordionTrigger } from './AccordionTrigger.vue'

// Root `type` axis values, exported so the showcase spec consumes this list
// instead of hand-copying it (single-source rule for control options).
export const accordionTypeKeys = ['single', 'multiple'] as const
