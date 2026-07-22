import type { ComponentSpec, SpecState } from '../lib/spec'
import { h } from 'vue'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  accordionTypeKeys,
} from '#/components/accordion'
import { boolAttr, strAttr } from '../lib/codegen'

interface Entry {
  value: string
  trigger: string
  content: string
}

const faqItems: Entry[] = [
  {
    value: 'data-storage',
    trigger: 'Where is my data stored?',
    content:
      'Everything stays in your own deployment: conversations and settings in the database, long-term memory in the vector store you configured. Nothing leaves the server unless you connect an external provider.',
  },
  {
    value: 'own-key',
    trigger: 'Can I use my own API key?',
    content:
      'Yes. Add a provider with your key, then point each bot at one of its models. Keys are stored server-side and are never sent to the browser.',
  },
  {
    value: 'move-bot',
    trigger: 'How do I move a bot to another server?',
    content:
      'Export the bot from its settings page. The archive carries its persona, memory configuration, and channel bindings, and imports into any other deployment.',
  },
]

const settingsItems: Entry[] = [
  {
    value: 'general',
    trigger: 'General',
    content: 'Display name, default language, and time zone. These shape how the bot presents itself in every conversation.',
  },
  {
    value: 'memory',
    trigger: 'Memory',
    content: 'Extraction and retrieval for long-term memory. Changes apply to new conversations; existing memories are kept.',
  },
  {
    value: 'channels',
    trigger: 'Channels',
    content: 'Connected platforms and their routing rules. A channel can be paused without losing its configuration.',
  },
]

export const accordionSpec: ComponentSpec = {
  id: 'accordion',
  name: 'Accordion',
  description:
    'A stacked set of collapsible sections behind animated headers — single-open or multi-open — for progressive disclosure of secondary content.',
  descriptionZh:
    '标题带动画的纵向折叠分区，可单开或多开——用于次要内容的渐进披露。',
  controls: [
    { kind: 'enum', key: 'type', label: 'Type', options: accordionTypeKeys, default: 'single', display: 'radio-list' },
    { kind: 'boolean', key: 'collapsible', label: 'Collapsible', default: true, when: state => state.type === 'single' },
  ],
  examples: [
    {
      name: 'All collapsed',
      nameZh: '全部收起',
      state: { open: '' },
    },
    {
      name: 'Settings groups',
      nameZh: '设置分组',
      state: { type: 'multiple', open: 'general,memory' },
      render: state => accordion(state, settingsItems),
      code: state => codeFor(state, settingsItems),
    },
  ],
  render: state => accordion(state, faqItems),
  code: state => codeFor(state, faqItems),
  usage: `Accordion stacks peer sections behind headers so secondary content stays out of the way — progressive disclosure, not a hiding place.

- Use it for FAQs, advanced settings, and other content the reader opens on demand. A trigger is a short noun or question; the content answers it in one or two sentences.
- type="single" + collapsible suits mutually exclusive reading (FAQ); type="multiple" suits independent sections (settings groups).
- Never put the page's primary action or a required field inside a collapsed panel — anything the user must see to proceed stays visible.
- Not navigation: switching between peer views is Tabs; one persistent flag is Toggle.`,
  usageZh: `Accordion 把同级内容收进标题之后，让次要内容让路——渐进披露，不是藏东西的地方。

- 用于 FAQ、高级设置等读者按需展开的内容。触发器是简短名词或问句；内容用一两句话作答。
- type="single" + collapsible 适合互斥阅读（FAQ）;type="multiple" 适合彼此独立的分组（设置）。
- 不要把页面主操作或必填项放进折叠面板——用户必须看到才能继续的东西保持可见。
- 不是导航：同级视图切换用 Tabs；一个持久开关位用 Toggle。`,
}

// The open set is NOT a declared control: it is driven live by clicking the
// canvas, serialized into the hidden `open` state key (comma-joined) so
// canvas, controls, and code panel all read the same source. Seeded with the
// first item open so the stage shows the expanded state (content, rotated
// chevron) on load. In the frozen examples wall the write-back is a harmless
// no-op, same as the overlay specs.
function rawOpen(state: SpecState, items: Entry[]): string {
  const cur = state.open
  if (typeof cur === 'string') return cur
  const first = items[0]
  if (!first) return ''
  state.open = first.value
  return first.value
}

function openValues(state: SpecState, items: Entry[]): string[] {
  const known = new Set(items.map(i => i.value))
  return rawOpen(state, items).split(',').filter(v => known.has(v))
}

function accordion(state: SpecState, items: Entry[]) {
  const multiple = state.type === 'multiple'
  const open = openValues(state, items)
  return h(
    Accordion,
    {
      type: state.type as never,
      // Only meaningful for type="single"; passing it in multiple mode would
      // break the root's prop union.
      ...(multiple ? {} : { collapsible: Boolean(state.collapsible) }),
      modelValue: (multiple ? open : open[0] ?? '') as never,
      // The root emits string (single) or string[] (multiple); widen the
      // callback to unknown, then narrow before serializing.
      'onUpdate:modelValue': (v: unknown) => {
        state.open = Array.isArray(v) ? v.join(',') : String(v ?? '')
      },
      class: 'w-96',
    },
    () => items.map(item =>
      h(AccordionItem, { key: item.value, value: item.value }, () => [
        h(AccordionTrigger, null, () => item.trigger),
        h(AccordionContent, null, () => item.content),
      ]),
    ),
  )
}

function codeFor(state: SpecState, items: Entry[]): string {
  const multiple = state.type === 'multiple'
  const open = openValues(state, items)
  const openAttr = open.length === 0
    ? ''
    : multiple
      ? ` :model-value="[${open.map(v => `'${v}'`).join(', ')}]"`
      : ` model-value="${open[0]}"`
  const attrs
    = strAttr('type', String(state.type))
    + (multiple ? '' : boolAttr('collapsible', Boolean(state.collapsible)))
    + openAttr
  const body = items
    .map(item => `  <AccordionItem value="${item.value}">
    <AccordionTrigger>${item.trigger}</AccordionTrigger>
    <AccordionContent>${item.content}</AccordionContent>
  </AccordionItem>`)
    .join('\n')
  return `<Accordion${attrs}>\n${body}\n</Accordion>`
}
