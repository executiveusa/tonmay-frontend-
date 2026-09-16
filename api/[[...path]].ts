import app from "vinext/server/app-router-entry";

export const config = { runtime: "edge" };

/**
 * Vercel mirror adapter. Sites remains the canonical Cloudflare deployment;
 * this keeps the owner-controlled Vercel project able to render the same
 * App Router surface without adding a second application or contact backend.
 */
export default async function handle(request: Request): Promise<Response> {
  return app.fetch(request, {}, { waitUntil() {} });
}
