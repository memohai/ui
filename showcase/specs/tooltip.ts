import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { Upload } from 'lucide-vue-next'
import { Button } from '#/components/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  tooltipAlignKeys,
  tooltipSideKeys,
} from '#/components/tooltip'
import { strAttr } from '../lib/codegen'

// Overlay specs pin `open` as a control so the canvas can show the overlay
// WITHOUT a hover — the whole point of the page is reviewing the open state.
// The trigger button stays as the realistic entry point; the two-way binding
// keeps pointer-leave close and the control in sync. The code snippet omits
// the pin on purpose: real tooltip usage is uncontrolled (hover/focus), so
// v-model:open would be noise for the copy-pasting reader.
export const tooltipSpec: ComponentSpec = {
  id: 'tooltip',
  name: 'Tooltip',
  description:
    'A short hover/focus hint for a control: an inverted flat pill, portaled above the canvas. Supplementary text only — unreachable on touch.',
  descriptionZh:
    '控件悬停/聚焦时的简短提示:反色扁平胶囊,portal 到画布上层。只放补充文字——触屏不可达。',
  controls: [
    { kind: 'boolean', key: 'open', label: 'Open', default: true },
    { kind: 'enum', key: 'side', label: 'Side', options: tooltipSideKeys, default: 'top', display: 'radio-list' },
    { kind: 'enum', key: 'align', label: 'Align', options: tooltipAlignKeys, default: 'center', display: 'radio-list' },
    { kind: 'string', key: 'label', label: 'Label', default: 'Save changes' },
  ],
  // side × align is the positioner grid a reviewer actually scans on an
  // overlay — every cell stays pinned open over its own trigger.
  matrix: { rows: 'side', cols: 'align' },
  examples: [
    {
      name: 'Icon button',
      nameZh: '图标按钮',
      render: state => tooltip(state, {
        trigger: () => h(Button, { variant: 'outline', size: 'icon', 'aria-label': 'Import' }, () => h(Upload)),
        label: 'Import',
      }),
      code: () => `<TooltipProvider>
  <Tooltip>
    <TooltipTrigger as-child>
      <Button variant="outline" size="icon" aria-label="Import">
        <Upload />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Import</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
    },
    {
      name: 'Disabled control',
      nameZh: '禁用元素',
      // A disabled button swallows pointer events, so the trigger wraps it in
      // a plain span that still receives hover.
      render: state => tooltip(state, {
        trigger: () => h('span', { class: 'inline-flex' }, [
          h(Button, { disabled: true }, () => 'Deploy'),
        ]),
        label: 'Only admins can deploy',
      }),
      code: () => `<TooltipProvider>
  <Tooltip>
    <TooltipTrigger as-child>
      <span class="inline-flex">
        <Button disabled>Deploy</Button>
      </span>
    </TooltipTrigger>
    <TooltipContent>Only admins can deploy</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
    },
  ],
  render: state => tooltip(state, {
    trigger: () => h(Button, { variant: 'outline' }, () => 'Save'),
    label: String(state.label),
  }),
  code: (state) => {
    const attrs
      = strAttr('side', String(state.side), 'top')
      + strAttr('align', String(state.align), 'center')
    return `<TooltipProvider>
  <Tooltip>
    <TooltipTrigger as-child>
      <Button variant="outline">Save</Button>
    </TooltipTrigger>
    <TooltipContent${attrs}>${state.label}</TooltipContent>
  </Tooltip>
</TooltipProvider>`
  },
  usage: `A Tooltip is a SHORT HINT on hover/focus — supplementary only. It never exists on touch, so nothing essential may live exclusively inside it.

- Plain text, one short line. No links, buttons, or any interactive content — that is Popover / HoverCard territory.
- Icon-only buttons always get a tooltip (plus an aria-label); a labeled button gets one only when it adds information the visible label doesn't.
- Disabled elements don't fire hover — wrap the control in a span and put the trigger on the span.
- The canvas pins the tooltip open for review; real usage is uncontrolled.`,
  usageZh: `Tooltip 是悬停/聚焦时的短提示——只作补充。触屏上没有悬停,所以关键信息绝不能只放在 tooltip 里。

- 纯文本,一行短句。不放链接、按钮等任何交互内容——那是 Popover / HoverCard 的场景。
- 纯图标按钮必须有 tooltip(并配 aria-label);有文字标签的按钮只在 tooltip 能补充标签之外的信息时才加。
- 禁用元素不触发悬停——外面包一个 span,把 trigger 放在 span 上。
- 画布为了 review 把 tooltip 钉在开态;真实用法是非受控的。`,
}

function tooltip(
  state: Record<string, unknown>,
  content: { trigger: () => unknown, label: string },
) {
  return h(TooltipProvider, null, () =>
    h(
      Tooltip,
      {
        open: Boolean(state.open),
        'onUpdate:open': (v: boolean) => (state.open = v),
      },
      () => [
        h(TooltipTrigger, { asChild: true }, content.trigger as never),
        h(
          TooltipContent,
          {
            side: state.side as never,
            align: state.align as never,
          },
          () => content.label,
        ),
      ],
    ),
  )
}
