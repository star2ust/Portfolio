import { extractVimeoId } from "@/lib/vimeo";
import styles from "./VideoEmbed.module.css";

export interface VideoEmbedProps {
  vimeoUrl: string;
  title: string;
  /** true inside VideoLightbox, where the iframe is the whole point of opening it in the first
   *  place — false (default) for any inline/poster context, so a video never starts playing
   *  (with sound, on a project detail page, unprompted) just because it scrolled into view. */
  autoplay?: boolean;
  className?: string;
}

/** Turns a plain Vimeo URL (whatever the site owner pastes into Sanity — a `/123456789` link or
 *  a full `player.vimeo.com` embed link) into a lazy, responsive `<iframe>`. Falls back to a
 *  plain link if the URL doesn't look like a Vimeo ID at all, so a malformed paste degrades to
 *  something clickable instead of a blank box. */
export function VideoEmbed({ vimeoUrl, title, autoplay = false, className }: VideoEmbedProps) {
  const id = extractVimeoId(vimeoUrl);
  if (!id) {
    return (
      <a href={vimeoUrl} target="_blank" rel="noreferrer" className={`${styles.fallback} ${className ?? ""}`}>
        {vimeoUrl}
      </a>
    );
  }
  return (
    <div className={`${styles.wrap} ${className ?? ""}`}>
      <iframe
        src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0${autoplay ? "&autoplay=1" : ""}`}
        title={title}
        className={styles.iframe}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
