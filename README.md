# @memohai/ui

Memoh's design system as a single distributable unit: the Vue 3 component
library, the design-token scales, **and the AI agent skills that teach an
agent to use them correctly**.

Extracted from the [Memoh](https://github.com/memohai/Memoh) monorepo
(`packages/ui`, full history preserved). Host repos consume it as a **git
submodule mounted at `packages/ui`** — not as an npm package — so Tailwind
scans the sources directly and the pnpm workspace resolves it by path with
zero build/publish step.

## What's inside

| Path | What it is |
|---|---|
| `src/` | Components + `style.css` (interaction contracts, radius/text/z/alpha token scales) |
| `AGENTS.md` | The atom-level design-token law. Read it before touching any component. |
| `skills/memoh-web/` | Page-level design-language skill (AI agent skill) |
| `skills/memoh-ui-owners/` | Spacing-owner vocabulary skill (AI agent skill) |
| `.storybook/` | The module's own living reference |

## Consuming as a submodule

```bash
git submodule add https://github.com/memohai/ui packages/ui
```

The mount point **must** be `packages/ui`: all internal path references
(in `AGENTS.md`, the skills, and the host-side contract guard) are written
from the host repo root and assume this location. Wire the skills into the
host's agent config by symlinking:

```bash
ln -s ../../packages/ui/skills/memoh-web  .agents/skills/memoh-web
ln -s ../../packages/ui/skills/memoh-ui-owners .agents/skills/memoh-ui-owners
```

Version pinning is the host's job: hosts pin a commit, bump via a one-line
PR. Framework versions are the host's job too — this package declares
`vue` as a peer dependency; the host lockfile decides the exact version.

## Developing

```bash
pnpm install
pnpm type-check
pnpm build
pnpm storybook
```

Day-to-day development happens inside a host checkout (`packages/ui/` is a
full git repo there — branch, commit, and push from within it), so changes
are validated against a real consumer. Coupled changes land as two PRs:
the ui PR merges first, then the host PR bumps the submodule pointer and
adapts call sites.

## Known gaps (first-cut extraction)

- **Contract guard runs host-side.** `scripts/check-ui-contract.mjs` in the
  Memoh repo enforces the token law over these sources; PRs here are only
  guard-checked when a host bumps its pointer. Parameterizing the guard and
  moving it into this repo's CI is a planned follow-up.
- **Owner components still live in the host** (`apps/web/src/components/`):
  SettingsRow, FieldStack, PageShell, etc. The `memoh-ui-owners` skill
  documents them, so a brand-new (non-Memoh-shaped) host doesn't get them
  from this repo yet. Promoting them into `src/` is a planned follow-up.
- **`skills/memoh-web/reference.md`** is a Memoh page map — host knowledge
  that travels here for now; splitting portable design language from
  host-specific references is a planned follow-up.
