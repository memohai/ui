// Hand-rolled syntax highlighting for the Code panel — a small state machine
// over Vue template source. Deliberately no shiki/prism dependency: snippets
// are tiny, the token set is six kinds, and a dev-only page should cost ~zero
// bundle weight. Colors come from the accent token palette as inline var()
// styles (the same JIT-safe pattern as the dev wall's TokenSwatch), so the
// highlight tracks scheme + dark mode for free.

export type CodeKind = 'tag' | 'attr' | 'string' | 'comment' | 'punct' | 'plain'

export interface CodeToken {
  text: string
  kind: CodeKind
}

export const KIND_COLORS: Record<CodeKind, string> = {
  tag: 'var(--accent-blue)',
  attr: 'var(--accent-purple)',
  string: 'var(--accent-green)',
  comment: 'var(--muted-foreground)',
  punct: 'var(--muted-foreground)',
  plain: 'var(--foreground)',
}

const NAME_CHARS = /[\w.:-]/
const ATTR_CHARS = /[\w:@#.\-]/

export function tokenize(src: string): CodeToken[] {
  const tokens: CodeToken[] = []
  let i = 0

  const push = (text: string, kind: CodeKind) => {
    if (text) tokens.push({ text, kind })
  }

  while (i < src.length) {
    // Comment: <!-- ... -->
    if (src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i + 4)
      const stop = end === -1 ? src.length : end + 3
      push(src.slice(i, stop), 'comment')
      i = stop
      continue
    }

    // Tag open: <Name or </Name
    if (src.charAt(i) === '<' && /[a-zA-Z/]/.test(src.charAt(i + 1))) {
      let j = i + 1
      if (src.charAt(j) === '/') j++
      push(src.slice(i, j), 'punct')
      let k = j
      while (k < src.length && NAME_CHARS.test(src.charAt(k))) k++
      push(src.slice(j, k), 'tag')
      i = k

      // Inside the tag: attrs / strings until '>'
      while (i < src.length && src.charAt(i) !== '>') {
        const ch = src.charAt(i)
        if (/\s/.test(ch)) {
          let k = i
          while (k < src.length && /\s/.test(src.charAt(k))) k++
          push(src.slice(i, k), 'plain')
          i = k
        }
        else if (ch === '/') {
          push('/', 'punct')
          i++
        }
        else if (ch === '"' || ch === '\'') {
          const end = src.indexOf(ch, i + 1)
          const stop = end === -1 ? src.length : end + 1
          push(src.slice(i, stop), 'string')
          i = stop
        }
        else if (ch === '=') {
          push('=', 'punct')
          i++
        }
        else {
          let k = i
          while (k < src.length && ATTR_CHARS.test(src.charAt(k))) k++
          if (k === i) {
            push(ch, 'plain')
            i++
          }
          else {
            push(src.slice(i, k), 'attr')
            i = k
          }
        }
      }
      if (src.charAt(i) === '>') {
        push('>', 'punct')
        i++
      }
      continue
    }

    // Plain text until the next tag/comment
    let k = i
    while (k < src.length && src.charAt(k) !== '<') k++
    push(src.slice(i, k), 'plain')
    i = k
  }

  return tokens
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }
function esc(s: string): string {
  return s.replace(/[&<>"]/g, c => ESCAPES[c] ?? c)
}

// Render tokens to HTML spans. Text is escaped first — safe for v-html.
export function highlightToHtml(src: string): string {
  return tokenize(src)
    .map((t) => {
      const italic = t.kind === 'comment' ? ' font-style:italic' : ''
      return `<span style="color:${KIND_COLORS[t.kind]};${italic}">${esc(t.text)}</span>`
    })
    .join('')
}
