# Personal Site (Nejay — Random Tourist)

A Persona 5-themed personal portfolio website with multilingual support (EN/JP/ID), BGM player, animated navigation, and a contact form.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/persona-site run dev` — run the frontend (port 25346)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Optional env: `DISCORD_WEBHOOK` — Discord webhook URL for the contact form

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion
- API: Express 5
- Build: esbuild (CJS bundle for API)

## Where things live

- `artifacts/persona-site/` — React/Vite frontend (served at `/`)
- `artifacts/persona-site/public/` — Static assets (fonts, images, favicon)
- `artifacts/persona-site/src/pages/home.tsx` — Main page with all sections
- `artifacts/api-server/src/routes/contact.ts` — Contact form → Discord webhook

## Architecture decisions

- Site is always in dark mode (`.dark` class on root) — Persona 5 aesthetic
- Custom P5Font loaded from `public/P5Font.ttf`
- BGM via YouTube IFrame API (video ID `NCmAaO6UeeQ`)
- Contact form POSTs to `/api/contact` and forwards to `DISCORD_WEBHOOK`
- Language switching (EN/JP/ID) is client-side only, no server involvement

## Product

A personal portfolio/persona page with: Introduction hero, Game Info (Genshin/HSR/ZZZ/P5X UIDs), Social links, About section, Contact form, and a System Config panel with toggles for animations, BGM volume, language, cursor style, and background effects.

## User preferences

- Persona 5 Royal visual style: magenta primary color, skewed elements, custom P5Font
- Contact form sends to Discord via webhook (DISCORD_WEBHOOK env var)

## Gotchas

- Set `DISCORD_WEBHOOK` env var for the contact form to work
- The backup folder `artifacts/persona-site-backup` was removed after setup; do not recreate it
