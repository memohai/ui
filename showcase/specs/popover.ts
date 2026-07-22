import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { Button } from '#/components/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '#/components/command'
import { Input } from '#/components/input'
import { PopoverClose } from 'reka-ui'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  popoverAlignKeys,
  popoverMotionKeys,
  popoverSideKeys,
} from '#/components/popover'
import { numAttr, strAttr } from '../lib/codegen'

// Uncontrolled (interactive: true): PopoverTrigger opens, Esc/outside-click
// closes. The canvas shows the closed trigger you click. NO `open` control —
// pinning writes into a per-render throwaway state (can never be closed) and,
// for modal overlays, freezes the page. Non-modal Popover wouldn't dead-lock,
// but the uncontrolled trigger is the honest, copy-pasteable demo anyway.
export const popoverSpec: ComponentSpec = {
  id: 'popover',
  name: 'Popover',
  interactive: true,
  description:
    'A small non-modal panel anchored to its trigger — reference info, a quick filter, a one-field form. Closes on Esc and outside click; the page stays interactive.',
  descriptionZh:
    '锚定在触发器上的小型非模态面板——参考信息、快速筛选、单字段表单。Esc 和点击外部关闭;页面保持可交互。',
  controls: [
    { kind: 'enum', key: 'side', label: 'Side', options: popoverSideKeys, default: 'bottom' },
    { kind: 'enum', key: 'align', label: 'Align', options: popoverAlignKeys, default: 'center', display: 'radio-list' },
    { kind: 'enum', key: 'motion', label: 'Motion', options: popoverMotionKeys, default: 'menu', display: 'radio-list' },
    { kind: 'number', key: 'sideOffset', label: 'Side offset', default: 4, min: 0, max: 24 },
  ],
  examples: [
    {
      name: 'Form in a popover',
      nameZh: '表单弹层',
      render: state =>
        popover(state, () => [
          h('p', { class: 'mb-2 text-body font-medium' }, 'Rename session'),
          h(Input, { modelValue: 'Launch plan', 'aria-label': 'Session title' }),
          h('div', { class: 'mt-3 flex justify-end' }, [
            h(PopoverClose, { asChild: true }, () => h(Button, { size: 'sm' }, () => 'Save')),
          ]),
        ]),
      code: () => `<Popover>
  <PopoverTrigger as-child>
    <Button variant="outline">Open popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p class="mb-2 text-body font-medium">Rename session</p>
    <Input v-model="title" aria-label="Session title" />
    <div class="mt-3 flex justify-end">
      <PopoverClose as-child>
        <Button size="sm">Save</Button>
      </PopoverClose>
    </div>
  </PopoverContent>
</Popover>`,
    },
    {
      name: 'Menu host',
      nameZh: '菜单宿主',
      render: state =>
        popover(state, () =>
          h(Command, null, () => [
            h(CommandInput, { placeholder: 'Search commands…' }),
            h(CommandList, null, () => [
              h(CommandEmpty, null, () => 'No results.'),
              h(CommandGroup, null, () => [
                h(CommandItem, { value: 'rename' }, () => 'Rename session'),
                h(CommandItem, { value: 'pin' }, () => 'Pin to top'),
                h(CommandItem, { value: 'archive' }, () => 'Archive'),
              ]),
            ]),
          ]), { menu: true }),
      code: () => `<Popover>
  <PopoverTrigger as-child>
    <Button variant="outline">Open popover</Button>
  </PopoverTrigger>
  <PopoverContent menu>
    <Command>
      <CommandInput placeholder="Search commands…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup>
          <CommandItem value="rename">Rename session</CommandItem>
          <CommandItem value="pin">Pin to top</CommandItem>
          <CommandItem value="archive">Archive</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>`,
    },
  ],
  render: state =>
    popover(state, () => [
      h('p', { class: 'text-body font-medium' }, 'Session options'),
      h('p', { class: 'mt-1 text-caption text-muted-foreground' }, 'These apply to this session only.'),
    ]),
  code: (state) => {
    const attrs
      = strAttr('side', String(state.side), 'bottom')
      + strAttr('align', String(state.align), 'center')
      + strAttr('motion', String(state.motion), 'menu')
      + numAttr('side-offset', Number(state.sideOffset), 4)
    return `<Popover>
  <PopoverTrigger as-child>
    <Button variant="outline">Open popover</Button>
  </PopoverTrigger>
  <PopoverContent${attrs}>
    <p class="text-body font-medium">Session options</p>
    <p class="mt-1 text-caption text-muted-foreground">These apply to this session only.</p>
  </PopoverContent>
</Popover>`
  },
  usage: `Popover is a light, NON-MODAL panel anchored to its trigger. It closes on Esc and outside click without asking — so nothing the user would hate to lose (unsaved multi-field work, confirmations) belongs here; that is Dialog's job.

- The trigger is a plain Button via PopoverTrigger as-child; the panel content lives in PopoverContent only.
- Keep content small and self-contained — the chromed panel is w-72 and self-sized. Long scrollable content or multi-step flows belong in a Dialog or Sheet.
- To host a menu surface (a picker with search) set menu on PopoverContent and let the inner Command own the chrome — never rebuild menu styling per call site.
- Hover-only reveals (definitions, previews) belong in HoverCard or Tooltip; Popover opens on click and stays until dismissed.`,
  usageZh: `Popover 是锚定在触发器上的轻量非模态面板。Esc 或点击外部就会不打招呼地关闭——所以任何用户怕丢的东西(未保存的多字段内容、确认决策)都不该放这里,那是 Dialog 的职责。

- 触发器是普通 Button,经 PopoverTrigger as-child 挂载;面板内容只放 PopoverContent 里。
- 内容保持小而自足——带 chrome 的面板是 w-72 自适应高度。长滚动内容或多步流程属于 Dialog 或 Sheet。
- 要承载菜单表面(带搜索的选择器)就给 PopoverContent 加 menu,让内部的 Command 自己持有 chrome——绝不在调用处手搓菜单样式。
- 纯 hover 的提示(释义、预览)用 HoverCard 或 Tooltip;Popover 点击打开,驻留到被关闭。`,
}

// Uncontrolled: PopoverTrigger opens, Esc/outside-click/PopoverClose closes.
function popover(
  state: Record<string, unknown>,
  content: () => unknown,
  contentProps: Record<string, unknown> = {},
) {
  return h(Popover, null, () => [
    h(PopoverTrigger, { asChild: true }, () => h(Button, { variant: 'outline' }, () => 'Open popover')),
    h(
      PopoverContent,
      {
        side: state.side as never,
        align: state.align as never,
        motion: state.motion as never,
        sideOffset: Number(state.sideOffset),
        ...contentProps,
      },
      content as never,
    ),
  ])
}
