import type { ComponentSpec, SpecState } from '../lib/spec'
import type { ToastOptions, ToastVariant } from '#/components/sonner'
import { h } from 'vue'
import { Button } from '#/components/button'
import { Toaster, toast, toastVariantKeys } from '#/components/sonner'

// Toast is an IMPERATIVE api — there is no tag to pin on the canvas, so the
// spec inverts the usual shape: the canvas holds a fire Button, the controls
// shape the toast() call the button makes, and code() shows that call.
//
// The spec mounts its own <Toaster> next to the button. In a real app the
// host mounts Toaster ONCE at the root and every feature just calls toast();
// here the per-page mount keeps the canvas self-contained. The store behind
// toast() is module-global, so in the Examples wall (several tiles mounted at
// once) each tile's Toaster renders the same list — identical columns stacked
// at the same corner, visually one. The Single stage is the primary surface.
export const sonnerSpec: ComponentSpec = {
  id: 'sonner',
  name: 'Sonner',
  description:
    'Transient feedback toasts fired imperatively via toast(). The host mounts <Toaster> once at the root; every feature calls toast.success() / toast.error() / … from anywhere.',
  descriptionZh:
    '命令式触发的瞬时反馈 toast。宿主应用在根部挂载一次 <Toaster>,各功能代码在任意位置调用 toast.success() / toast.error() 等。',
  controls: [
    { kind: 'enum', key: 'variant', label: 'Variant', options: toastVariantKeys, default: 'message', display: 'radio-list' },
    { kind: 'string', key: 'title', label: 'Title', default: 'Changes saved' },
    { kind: 'string', key: 'description', label: 'Description', default: '' },
    { kind: 'boolean', key: 'action', label: 'Undo action', default: false },
    { kind: 'number', key: 'duration', label: 'Duration (ms)', default: 4000, min: 0, max: 10000 },
  ],
  examples: [
    {
      name: 'Success feedback',
      nameZh: '成功反馈',
      state: { variant: 'success', title: 'Changes saved' },
    },
    {
      name: 'Failure with detail',
      nameZh: '失败反馈',
      state: { variant: 'error', title: 'Upload failed', description: 'The file exceeds the 10 MB limit.' },
    },
    {
      name: 'Undoable action',
      nameZh: '可撤销操作',
      state: { variant: 'message', title: 'Session archived', action: true },
      code: () => `toast('Session archived', {
  action: {
    label: 'Undo',
    onClick: () => restoreSession(id),
  },
})`,
    },
  ],
  render: state => [
    h(Button, { onClick: () => fire(state) }, () => 'Fire toast'),
    h(Toaster),
  ],
  code: (state) => {
    const variant = String(state.variant)
    const description = String(state.description)
    const duration = Number(state.duration)
    const options: string[] = []
    if (description) options.push(`description: '${description}'`)
    if (state.action) options.push('action: { label: \'Undo\', onClick: undo }')
    if (duration !== 4000) options.push(`duration: ${duration}`)
    // Bare toast() IS the message variant — the namespace only appears for the
    // semantic variants.
    const call = variant === 'message' ? 'toast' : `toast.${variant}`
    if (options.length === 0) return `${call}('${state.title}')`
    return `${call}('${state.title}', {\n  ${options.join(',\n  ')},\n})`
  },
  usage: `Toast is for TRANSIENT feedback about something that already happened — a save, a failure, an undoable step. Never the only carrier of must-read information: decisions belong in a Dialog, persistent state belongs inline on the page.

- The host mounts <Toaster> ONCE at the app root (default dock: top-right). Feature code never renders Toaster — it calls toast() / toast.success() / toast.error().
- Keep the title a short headline; put detail in description. A long titleless blob (raw backend error, path, URL) auto-shapes into a variant heading + gray body — a safety net, not a style to aim for. Write your own title + description whenever you can.
- action is for ONE reversible step ("Undo") — not navigation, not a second decision.
- Pass a stable id to update a toast in place (progress → done) instead of stacking a new one.
- duration: 0 keeps the toast until dismissed — reserve that for failures the user must acknowledge.`,
  usageZh: `Toast 用于已经发生的事情的瞬时反馈——保存成功、失败、可撤销的一步。绝不承载必须读到的信息:决策用 Dialog,持久状态内联在页面上。

- 宿主应用在根部挂载一次 <Toaster>(默认停靠右上)。功能代码从不渲染 Toaster——只调用 toast() / toast.success() / toast.error()。
- 标题保持短标题式;细节放 description。无标题的长文本(原始后端报错、路径、URL)会自动整形成"变体标题 + 灰色正文"——那是安全网,不是要追求的风格。能自己写标题 + description 就自己写。
- action 只用于一个可逆步骤("Undo")——不做导航,不做二次决策。
- 传稳定的 id 可以原地更新同一个 toast(进度 → 完成),而不是叠一个新的。
- duration 设 0 表示不自动消失——只留给必须让用户确认的失败。`,
}

function fire(state: SpecState) {
  const variant = String(state.variant) as ToastVariant
  const description = String(state.description)
  const options: ToastOptions = { duration: Number(state.duration) }
  if (description) options.description = description
  // Demo action is a deliberate no-op: the point is the button's placement and
  // the auto-dismiss on click, both owned by <Toaster>.
  if (state.action) options.action = { label: 'Undo', onClick: () => {} }
  toast[variant](String(state.title), options)
}
