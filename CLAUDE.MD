# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start        # Dev server on port 4200 (webpack mode)
npm run build        # Production build (webpack mode)
npm run lint         # ESLint
npm run test         # Vitest (run all tests once)
npm run format       # Check Prettier formatting
npm run format:write # Fix Prettier formatting
```

Run a single test file:
```bash
npx vitest run src/path/to/file.spec.ts
```

## Architecture

This is a **Next.js 16 App Router** application (webpack mode, standalone output) serving as the "Global Trusted Data Commons" portal — a statistical data conversation platform built on EPAM's DIAL API.

### Request / rendering flow

```
browser
  → proxy.ts              (i18n prefix, optional NextAuth guard, CSP headers)
  → /[locale]/layout.tsx   (I18nProvider, locale wrapper)
  → /[locale]/conversations/layout.tsx  (server: auth check, deployment config,
                                         dataset metadata, provider tree)
  → /[locale]/conversations/page.tsx    (welcome or new conversation)
  → /[locale]/conversations/[...id]/page.tsx  (existing conversation)
```

### Provider tree (conversations layout)

Server components fetch data and pass it down; client providers wrap the subtree:

```
ComponentsConfig          (UI component overrides — InlineAlertProvider)
  TextsConfig             (i18n text overrides — ConversationViewMessagesProvider)
    DeploymentConfigProvider  (agent suggestions, welcome text from DIAL deployment)
      ClientProvidersWrapper  (feature toggles, dataset metadata, chat state)
        ConversationListProvider
          ConversationListWrapper (sidebar)
          <main>{children}</main>
```

`ComponentsConfig` and `TextsConfig` in `src/components/configs/` are the integration seams — override UI component behaviour and i18n strings coming from the `@epam/statgpt-*` packages without touching the packages themselves.

`src/components/ConversationView/ConversationViewWrapper.tsx` is the main app-level integration point for the conversation UI. It assembles all icon props, message action icons, `limitMessages`, metadata settings, and filter actions, then passes them to `ConversationView` from `@epam/statgpt-conversation-view`. Any icon that appears inside the conversation view (copy, edit, thumbs, warning, etc.) is configured here.

**`RequestLimitMessage` vs `InlineAlert`:** The warning banner shown when a query hits the series limit is rendered by `RequestLimitMessage` (from `@epam/statgpt-ui-components`), **not** by `InlineAlert`. Its container styling and icon come from the `limitMessages: LimitMessages` prop built in `ConversationViewWrapper` — specifically `limitMessages.warningIcon`, `limitMessages.containerClassName`, and `limitMessages.limitMessageClassName`. Changing `InlineAlertConfig` has no effect on this component.

### API layer

- `src/app/api/api.ts` — singleton instances of `SdmxApiClient`, `DialApiClient`, and `ConversationApi` configured from env vars. Imported by route handlers.
- `src/app/api/api-client.ts` — thin browser-side fetch wrapper used by client components.
- Route handlers under `src/app/api/` proxy to DIAL API or SDMX API. The catch-all `src/app/api/[[...path]]/route.ts` returns 404 for anything not explicitly handled.
- `/api/dial/:path*` is rewritten to `DIAL_API_URL/api/:path*` via `next.config.ts` rewrites.
- `/api/chat` streams responses from DIAL using SSE (converts null-byte-delimited DIAL chunks to standard `data:` SSE format).
- Auth is handled by NextAuth (`/api/auth/[...nextauth]`) with a custom federated logout endpoint.

### Key env vars

| Var | Purpose |
|---|---|
| `DIAL_API_URL` | Base URL for DIAL API (also used for SDMX proxy) |
| `DIAL_API_KEY` | API key for server-side DIAL calls |
| `DIAL_API_VERSION` | DIAL API version (default: `2025-01-01-preview`) |
| `SDMX_API_URL` | Direct SDMX URL; if unset, routes through DIAL proxy |
| `DEFAULT_MODEL` | Default chat model ID (default: `gpt-4-turbo`) |
| `CROSS_DATASET_MODE` | Boolean toggle — enables cross-dataset features and side-panel metadata |
| `ALLOWED_FRAME_ANCESTORS` | CSP `frame-ancestors` value |
| `CLIENT_CONTACT_SUPPORT_URL` | URL used in error messages |
| `ENABLE_AUTH` | Toggle for NextAuth guard |

### Auth

`proxy.ts` conditionally wraps with `withAuth` based on `ENABLE_AUTH`. Auth utilities live in `src/utils/auth/`. Route handlers use `withAuth` HOF from the same utils to extract the bearer token and pass it to API clients.

### i18n

Single locale (`en`) via `next-international`. Locale files in `src/locales/en/`. Server/client split: `src/locales/server.ts` and `src/locales/client.tsx`.

### Styles

CSS entry point: `src/app/globals.scss` → `src/scss/styles.scss`. That file:
- Pulls in Tailwind base/components/utilities
- `@use`s individual SCSS partials (`colors.scss`, `alert.scss`, etc.)
- `@import`s `@epam/statgpt-ui-components/styles-tailwind.scss` for component styles from the package (uses `@apply` — processed by PostCSS/Tailwind at build time)

CSS custom properties (design tokens) are defined in `src/scss/colors.scss` as `:root` variables. Tailwind's `theme.colors` maps these tokens using `var(--token-name)`.

Tailwind content scan includes `./node_modules/@epam/statgpt-*/**/*.{js,ts,jsx,tsx,mjs}` so utility classes used inside published packages are generated. SVG files in `public/` are imported as React components (default export) via the `@svgr/webpack` rule in `next.config.ts`.

### Testing

Vitest with `@testing-library/react` and `jsdom`. Test files use `.spec.ts` / `.spec.tsx` suffix alongside source files. Currently minimal coverage — only `src/constants/__tests__/` has tests.
