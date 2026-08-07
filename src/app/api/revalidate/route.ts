import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

interface WebhookDoc {
  _type: string;
}

/**
 * Sanity webhook target — set this up once in the Sanity project's dashboard
 * (Settings → API → Webhooks): URL = https://<your-domain>/api/revalidate, trigger on
 * Create/Update/Delete, and set the same secret here as SANITY_REVALIDATE_SECRET in Vercel's
 * env vars. On publish, Sanity POSTs the changed document here; this revalidates exactly the
 * Next.js data tag for that document type (see src/sanity/queries.ts's TAGS), so the live site
 * updates within seconds instead of waiting for the next full rebuild.
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookDoc>(req, process.env.SANITY_REVALIDATE_SECRET);

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: "Missing _type in payload" }, { status: 400 });
    }

    // "max": recommended stale-while-revalidate profile — serve the (soon-to-be-stale) cached
    // page immediately to any in-flight request while this tag's data refreshes in the background.
    revalidateTag(body._type, "max");

    return NextResponse.json({ revalidated: true, type: body._type, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}
