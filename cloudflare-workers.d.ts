/**
 * The portfolio has no database calls in its public Next.js surface.
 * Sites provides this module at the Cloudflare runtime; the declaration lets
 * Vercel type-check the shared source without pretending that binding exists.
 */
declare module "cloudflare:workers" {
  export const env: { DB?: unknown };
}
