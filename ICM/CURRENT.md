# Tonmay — Current State

## Repository
- Repo: `executiveusa/tonmay-frontend-`
- Default branch: `main`
- Production platform: Vercel
- Production URL: https://tonmay-frontend.vercel.app
- Production project: `prj_aL8cRGd8mQv9XvjDRn1WlJ7rc0YD`

## Current stage
`30_validate` — Gauntlet validation and bounded remediation.

## Baseline
- Baseline production SHA: `85821e48338ba4d17ba3cfc6b77db82485229b1e`
- Baseline production deployment: `dpl_94QmUPuu1miDzyJbZSXAcQ8HvUi7`
- Baseline routes verified: `/` and `/gallery` return 200.
- Vercel runtime errors: none found in the audited 7-day window.

## Read scope
Agents may inspect the repository, production runtime, deployment state, public routes, tests, and project documentation.

## Write scope
For remediation:
- use an isolated branch;
- make bounded changes only;
- preserve rollback to the baseline SHA;
- do not fabricate portfolio proof;
- do not merge or deploy without post-change evidence.

## Current remediation branch
`audit/gauntlet-next-move-2026-09-22`

## Pass bar
Before release:
1. build/deploy succeeds;
2. exact commit is known;
3. primary routes work;
4. production or preview metadata is correct;
5. no new runtime blocker appears;
6. independent review is still required for a formal Gauntlet PASS.

## Next handoff
Fresh critic / visual QA after preview verification.
