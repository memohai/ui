import type { VNodeChild } from 'vue'
import type { ComponentSpec, SpecState } from '../lib/spec'
import { h } from 'vue'
import { Copy, Pencil, Trash2 } from 'lucide-vue-next'
import { Button } from '#/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  dropdownMenuItemVariantKeys,
} from '#/components/dropdown-menu'
import { boolAttr, strAttr } from '../lib/codegen'

// Uncontrolled (interactive: true): DropdownMenuTrigger opens, Esc/outside-click
// closes. The canvas shows the closed trigger you click — no `open` prop is
// threaded, so the menu can never wedge open and freeze the page.
function menu(items: () => VNodeChild) {
  return h(DropdownMenu, null, () => [
    h(DropdownMenuTrigger, { asChild: true }, () =>
      h(Button, { variant: 'outline' }, () => 'Open menu')),
    h(DropdownMenuContent, null, items),
  ])
}

// The default composition doubles as the "icons + shortcut + destructive row"
// reference: row icons are dropped in bare (the row recipe sizes them to 4 and
// mutes them), the destructive row is the item's `variant` prop, never red
// text classes.
function defaultItems(state: SpecState) {
  return () => [
    h(DropdownMenuItem, null, () => [h(Pencil), 'Rename']),
    h(DropdownMenuItem, { disabled: Boolean(state.disabled) }, () => [
      h(Copy),
      'Duplicate',
      h(DropdownMenuShortcut, null, () => '⌘D'),
    ]),
    h(DropdownMenuSeparator),
    h(DropdownMenuItem, { variant: state.variant as never }, () => [h(Trash2), 'Delete session']),
  ]
}

export const dropdownMenuSpec: ComponentSpec = {
  id: 'dropdown-menu',
  name: 'DropdownMenu',
  interactive: true,
  description:
    'A trigger-anchored menu of actions. Rows, separators, labels and the panel chrome all come from the shared menu vocabulary; Esc and outside click close it.',
  descriptionZh:
    '锚定在触发器上的动作菜单。行、分隔线、标签和面板外观全部来自共享的菜单词汇;Esc 和点击外部关闭。',
  controls: [
    {
      kind: 'enum',
      key: 'variant',
      label: 'Last row variant',
      options: dropdownMenuItemVariantKeys,
      default: 'destructive',
      display: 'radio-list',
    },
    { kind: 'boolean', key: 'disabled', label: 'Disable "Duplicate"', default: false },
  ],
  examples: [
    {
      name: 'Groups and labels',
      nameZh: '分组与标签',
      render: () =>
        menu(() => [
          h(DropdownMenuGroup, null, () => [
            h(DropdownMenuLabel, null, () => 'Session'),
            h(DropdownMenuItem, null, () => 'Rename'),
            h(DropdownMenuItem, null, () => 'Duplicate'),
          ]),
          h(DropdownMenuSeparator),
          h(DropdownMenuGroup, null, () => [
            h(DropdownMenuLabel, null, () => 'Danger zone'),
            h(DropdownMenuItem, { variant: 'destructive' }, () => 'Delete session'),
          ]),
        ]),
      code: () => `<DropdownMenu>
  <DropdownMenuTrigger as-child>
    <Button variant="outline">Open menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuLabel>Session</DropdownMenuLabel>
      <DropdownMenuItem>Rename</DropdownMenuItem>
      <DropdownMenuItem>Duplicate</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuLabel>Danger zone</DropdownMenuLabel>
      <DropdownMenuItem variant="destructive">Delete session</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>`,
    },
    {
      name: 'Disabled row',
      nameZh: '禁用行',
      state: { disabled: true },
    },
  ],
  render: state => menu(defaultItems(state)),
  code: (state) => {
    const duplicateAttrs = boolAttr('disabled', Boolean(state.disabled))
    const deleteAttrs = strAttr('variant', String(state.variant), 'default')
    return `<DropdownMenu>
  <DropdownMenuTrigger as-child>
    <Button variant="outline">Open menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>
      <Pencil />
      Rename
    </DropdownMenuItem>
    <DropdownMenuItem${duplicateAttrs}>
      <Copy />
      Duplicate
      <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem${deleteAttrs}>
      <Trash2 />
      Delete session
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`
  },
  usage: `DropdownMenu is a trigger-anchored ACTION menu — commands that act on the trigger's context. Picking a value is Select; navigation belongs on a page.

- Rows come from the shared menu vocabulary (src/lib/menu.ts): px-2.5 / py-1.5 / text-control / rounded-menu row geometry and the [data-highlighted] row highlight. Never restyle row height, padding or highlight per menu.
- A row's only feedback is the highlight. A persisted selection is an indicator (DropdownMenuCheckboxItem / RadioItem), never a row background.
- Drop icons in bare — the row recipe sizes them to 4 and mutes them. A destructive row is variant="destructive" on the item, not red text classes.
- Group with Label + Separator and keep labels to a word or two; one menu is one short list. Deep hierarchies do not belong in stacked submenus.
- The trigger is usually an outline or ghost Button via as-child.`,
  usageZh: `DropdownMenu 是锚定在触发器上的动作菜单——对触发器上下文执行的命令。选值用 Select;导航属于页面。

- 行来自共享菜单词汇(src/lib/menu.ts):px-2.5 / py-1.5 / text-control / rounded-menu 的行几何和 [data-highlighted] 高亮。永远不要按菜单重写行高、内边距或高亮。
- 行唯一的反馈是高亮。持久选中用指示器(DropdownMenuCheckboxItem / RadioItem),绝不用行底色。
- 图标裸放即可——行配方会把它们定到 4 号并置灰。危险行用 item 上的 variant="destructive",不要手写红色文字类。
- 用 Label + Separator 分组,标签控制在一两个词;一个菜单就是一个短列表。深层层级不属于叠层子菜单。
- 触发器通常是通过 as-child 挂的 outline 或 ghost Button。`,
}
