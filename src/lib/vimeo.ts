/** Shared Vimeo helpers — parsing whatever URL shape the site owner pastes into Sanity (a plain
 *  `/123456789` link or a full `player.vimeo.com` embed link) and fetching a real poster image
 *  for it, so the detail page's video tile can show an actual 16:9 preview instead of embedding
 *  the live player just to have *something* to look at before it's clicked. */

export function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

export interface VimeoOEmbed {
  thumbnailUrl: string;
  width: number;
  height: number;
}

/** Vimeo's oEmbed endpoint needs no API key for a public video. Server-side only (called from a
 *  Server Component/page) — this is a real network request, cached by Next's fetch cache for a
 *  day since a video's thumbnail practically never changes.
 *
 *  Any failure (private/unlisted video, malformed paste, Vimeo hiccup) resolves to null rather
 *  than throwing — the caller still needs to render *something* for that video slot even without
 *  a thumbnail (a plain placeholder chip), not fail the whole project page over a bad URL. */
export async function getVimeoOEmbed(vimeoUrl: string): Promise<VimeoOEmbed | null> {
  try {
    const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(vimeoUrl)}`, {
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { thumbnail_url?: string; width?: number; height?: number };
    if (!data.thumbnail_url) return null;
    return { thumbnailUrl: data.thumbnail_url, width: data.width ?? 16, height: data.height ?? 9 };
  } catch {
    return null;
  }
}
