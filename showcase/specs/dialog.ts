import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { Button } from '#/components/button'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/dialog'
import { Input } from '#/components/input'

// Overlay specs carry an `open` control, default CLOSED: the page enters calm
// (a scrim modal must never fire on arrival), the trigger button is the
// realistic entry point, and the two-way binding keeps the overlay open while
// the reviewer tweaks other controls. Examples and the matrix pin open in
// their own state — showing the open surface is THEIR job, not the default's.
export const dialogSpec: ComponentSpec = {
  id: 'dialog',
  name: 'Dialog',
  description:
    'A modal surface over a scrim for decisions and short forms. Composed from Header/Title/Description/Body/Footer; closes on Esc and scrim click.',
  descriptionZh:
    'scrim 之上的模态表面,用于确认决策和短表单。由 Header/Title/Description/Body/Footer 组合;Esc 和点击 scrim 关闭。',
  controls: [
    { kind: 'boolean', key: 'open', label: 'Open', default: false },
    { kind: 'boolean', key: 'showClose', label: 'Close button', default: true },
  ],
  examples: [
    {
      name: 'Destructive confirm',
      nameZh: '危险确认',
      state: { open: true },
      render: state => dialog(state, {
        title: 'Delete session',
        description: 'This permanently deletes the session and its history. There is no undo.',
        body: () => [],
        confirm: () => h(Button, { variant: 'destructive' }, () => 'Delete'),
      }),
      code: () => `<Dialog v-model:open="open">
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete session</DialogTitle>
      <DialogDescription>This permanently deletes the session and its history. There is no undo.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose as-child>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    },
    {
      name: 'Short form',
      nameZh: '短表单',
      state: { open: true },
      render: state => dialog(state, {
        title: 'Rename session',
        description: 'The title shows in the session list.',
        body: () => h(Input, { modelValue: 'Launch plan', 'aria-label': 'Session title' }),
        confirm: () => h(Button, null, () => 'Save'),
      }),
      code: () => `<Dialog v-model:open="open">
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Rename session</DialogTitle>
      <DialogDescription>The title shows in the session list.</DialogDescription>
    </DialogHeader>
    <DialogBody>
      <Input v-model="title" aria-label="Session title" />
    </DialogBody>
    <DialogFooter>
      <DialogClose as-child>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    },
  ],
  render: state => dialog(state, {
    title: 'Delete session',
    description: 'This permanently deletes the session and its history. There is no undo.',
    body: () => [],
    confirm: () => h(Button, { variant: 'destructive' }, () => 'Delete'),
  }),
  code: state =>
    `<Dialog v-model:open="open">
  <DialogContent${state.showClose ? '' : ' :show-close-button="false"'}>
    <DialogHeader>
      <DialogTitle>Delete session</DialogTitle>
      <DialogDescription>This permanently deletes the session and its history. There is no undo.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose as-child>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
  usage: `Dialog is for DECISIONS and short forms — one focused task per surface. Long content and multi-step flows belong on a page or in a Sheet.

- The trigger is a plain Button; the Dialog itself wraps DialogContent only.
- Cancel always comes first in the footer, as a DialogClose around an outline Button; the action button states the consequence ("Delete", not "OK").
- Do not nest dialogs. Do not put navigation inside a dialog.`,
  usageZh: `Dialog 用于决策和短表单——一个表面一件聚焦的事。长内容和多步流程属于页面或 Sheet。

- 触发器是普通 Button;Dialog 本身只包 DialogContent。
- 取消永远在 footer 最前,用 DialogClose 包一个 outline Button;动作按钮写明后果("Delete",不是"OK")。
- 不要嵌套 dialog,不要在 dialog 里放导航。`,
}

function dialog(
  state: Record<string, unknown>,
  content: { title: string, description: string, body: () => unknown, confirm: () => unknown },
) {
  return [
    h(Button, { onClick: () => (state.open = true) }, () => 'Open dialog'),
    h(
      Dialog,
      {
        open: Boolean(state.open),
        'onUpdate:open': (v: boolean) => (state.open = v),
      },
      () =>
        h(DialogContent, { showCloseButton: Boolean(state.showClose) }, () => [
          h(DialogHeader, null, () => [
            h(DialogTitle, null, () => content.title),
            h(DialogDescription, null, () => content.description),
          ]),
          h(DialogBody, null, content.body as never),
          h(DialogFooter, null, () => [
            h(DialogClose, { asChild: true }, () => h(Button, { variant: 'outline' }, () => 'Cancel')),
            content.confirm(),
          ]),
        ]),
    ),
  ]
}
