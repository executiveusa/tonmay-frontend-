# Tonmay — Current State

## Repository
- Repo: `executiveusa/tonmay-frontend-`
- Default branch: `main`
- Production platform: Vercel
- Production URL: https://tonmay-frontend.vercel.app
- Production project: `prj_aL8cRGd8mQv9XvjDRn1WlJ7rc0YD`

## Current stage
`30_validate` — final technical cleanup and hold for verified portfolio proof.

## Current production baseline
- Production SHA: `abe2308b9f9a61b16324de2ddd3edfdbbfdb9f6c`
- Production deployment: `dpl_5dawmBJdX9vHu95WaHrXgpmecPEr`
- Verified routes: `/` and `/gallery` return 200.
- Current Vercel status: success.
- Runtime errors: none found in the latest 24-hour audit window.
- Netlify: no matching Tonmay project.

## Active cleanup branch
`chore/final-cleanup-2026-09-22`

## Read scope
Agents may inspect the repository, production runtime, deployment state, public routes, tests, and project documentation.

## Write scope
For cleanup or remediation:
- use an isolated branch;
- make bounded changes only;
- preserve rollback to the production SHA above;
- do not fabricate portfolio proof;
- do not merge or deploy without post-change evidence.

## Current content hold
Do not add client, assignment, testimonial, award, result, or project-detail claims until verified source information is supplied.

## Pass bar
Before release:
1. preview deploy succeeds;
2. exact branch SHA is known;
3. changed routes/metadata/behavior are verified;
4. merge is tied to the expected head SHA;
5. exact merged SHA reaches Vercel production `READY`;
6. `/` and `/gallery` remain healthy;
7. no new runtime blocker appears.

## Next handoff
After this cleanup release, hold for verified portfolio/project context. No further visual expansion is currently required.
