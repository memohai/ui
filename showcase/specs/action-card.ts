import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { ArrowUpRight, FolderCog } from 'lucide-vue-next'
import { ActionCard } from '#/components/action-card'
import { strAttr } from '../lib/codegen'

export const actionCardSpec: ComponentSpec = {
  id: 'action-card',
  name: 'ActionCard',
  description:
    'A card that IS an action: leading icon, title, and a forward affordance. The entry-point pattern — not a display card with a click bolted on.',
  controls: [
    { kind: 'string', key: 'title', label: 'Title', default: 'Workspace settings' },
    { kind: 'string', key: 'description', label: 'Description', default: 'Files, commands, and runtime limits' },
    { kind: 'boolean', key: 'external', label: 'External link', default: false },
  ],
  render: state =>
    h(
      ActionCard,
      {
        title: String(state.title),
        description: String(state.description),
        class: 'w-96',
        ...(state.external ? { as: 'a', href: '#' } : {}),
      },
      {
        icon: () => h(FolderCog),
        ...(state.external
          ? { trailing: () => h(ArrowUpRight, { class: 'size-4 shrink-0 text-muted-foreground' }) }
          : {}),
      },
    ),
  code: (state) => {
    if (state.external) {
      return `<ActionCard
  as="a"
  href="#"
${strAttr('title', String(state.title), '')}
${strAttr('description', String(state.description), '')}
>
  <template #icon><FolderCog /></template>
  <template #trailing><ArrowUpRight class="size-4 shrink-0 text-muted-foreground" /></template>
</ActionCard>`
    }
    return `<ActionCard
${strAttr('title', String(state.title), '')}
${strAttr('description', String(state.description), '')}
>
  <template #icon><FolderCog /></template>
</ActionCard>`
  },
  usage: `Reach for ActionCard when a row is a DOOR to a next surface (a focused dialog, a detail pane, an external URL).

- The #icon slot is required — the card bakes in no glyph, so it never becomes icon-abuse it can't justify.
- Trailing defaults to a forward chevron; external links override with ArrowUpRight.
- Deep/rare operations belong behind one of these (the 99/1 rule) — never an in-card "Advanced" disclosure.
- A list of same-weight peers is Item, not a stack of ActionCards.`,
}
