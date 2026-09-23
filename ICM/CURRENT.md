# Tonmay — Current State

## Repository
- Repo: `executiveusa/tonmay-frontend-`
- Default branch: `main`
- Production platform: Vercel
- Production URL: https://tonmay-frontend.vercel.app
- Production project: `prj_aL8cRGd8mQv9XvjDRn1WlJ7rc0YD`

## Current stage
`40_hold` — production cleanup complete; waiting for verified portfolio/project context.

## Verified production
- Last fully verified production code commit: `da4499c6aa312b6ab84a105bfc29c4540021d222`
- Verified production deployment: `dpl_55Z2cGa9kgFvQXEcpZCGXiXeMTa8`
- Deployment state: `READY`
- Canonical Vercel alias attached: `tonmay-frontend.vercel.app`
- Verified routes on that deployment: `/` and `/gallery`
- Verified cleanup markers:
  - inquiry fields expose `aria-invalid`
  - gallery has dedicated Twitter metadata
  - gallery canonical/Open Graph URL points to `/gallery`
  - Summer Study full-frame treatment is preserved
  - Stair Study full-frame treatment is preserved
- Runtime errors: none found in the final verification window.
- Netlify: no matching Tonmay project.

## Active work
No active remediation branch or open pull request is required for the website.

## Read scope
Agents may inspect the repository, production runtime, deployment state, public routes, tests, and project documentation.

## Write scope
For future changes:
- use an isolated branch;
- make bounded changes only;
- preserve rollback to the current verified production;
- do not fabricate portfolio proof;
- verify the exact branch/commit before merge;
- verify the exact merged SHA in production before claiming completion.

## Content hold
Do not add client, assignment, testimonial, award, result, or project-detail claims until verified source information is supplied.

## Current pass bar
Before any future release:
1. preview/deploy succeeds;
2. exact branch SHA is known;
3. changed routes/metadata/behavior are verified;
4. merge is tied to the expected head SHA;
5. exact merged SHA reaches Vercel production `READY`;
6. `/` and `/gallery` remain healthy;
7. no new runtime blocker appears.

## Next handoff
Resume only when verified portfolio/project context is available or a new product requirement is approved.
