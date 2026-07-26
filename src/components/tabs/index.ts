export { default as Tabs } from './Tabs.vue'
export { default as TabsContent } from './TabsContent.vue'
export { default as TabsList } from './TabsList.vue'
export { default as TabsTrigger } from './TabsTrigger.vue'

// TabsList.variant is a plain string-literal prop in TabsList.vue (no cva), so
// the axis keys live here next to the re-exports as the single source consumed
// by the showcase spec — mirror of the literal union in TabsList.vue, keep in
// sync (badgeVariantKeys precedent).
export const tabsListVariantKeys = ['underline', 'pill'] as const satisfies readonly ('underline' | 'pill')[]
