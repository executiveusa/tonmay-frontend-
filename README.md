# Tonmay Production

Photography and select-film portfolio/service site for Seattle and Western Washington.

## Production

- Live site: https://tonmay-frontend.vercel.app
- Hosting: Vercel
- Vercel project: `prj_aL8cRGd8mQv9XvjDRn1WlJ7rc0YD`
- Default branch: `main`

## Start here

Read these before changing the site:

1. `ICM/MISSION.md` — purpose, audience, design laws, and proof constraints
2. `ICM/CURRENT.md` — current stage, production state, write scope, and pass bar
3. `ICM/DECISIONS.md` — important project decisions and rollback context

## Product surfaces

- `/` — main portfolio/service site
- `/gallery` — full photography archive
- `/api/inquiry` — project inquiry delivery endpoint

## Core stack

- Next.js 16
- React 19
- Framer Motion
- TypeScript
- Vercel production deployment

The repository also retains legacy Vinext/Cloudflare scaffolding from the original starter. Do not treat that scaffolding as the current product architecture unless a task explicitly targets it.

## Local commands

```bash
npm install
npm run build
npm test
```

Node requirement: `>=22.13.0`.

## Release rules

- Work on an isolated branch for bounded remediation.
- Preserve rollback to the current production SHA.
- Verify the exact branch/commit on Vercel before merge.
- After merge, verify the exact merged SHA is `READY` in production.
- Check `/`, `/gallery`, runtime errors, and any changed behavior.
- Do not invent client names, assignments, testimonials, results, awards, or locations.
- Photography remains the primary visual proof.
- Do not add motion unless it materially improves hierarchy, orientation, state, or brand character.

## Current hold

The next content-level improvement is richer project/assignment context for selected portfolio work. That work is intentionally on hold until verified project information is available.
