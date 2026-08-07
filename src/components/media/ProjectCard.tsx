import type { CSSProperties, MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { storeFlipRect } from "@/motion/flip";
import styles from "./ProjectCard.module.css";

export interface ProjectCardProps {
  href: string;
  title: string;
  tech: string;
  year: string | number;
  image?: string;
  priority?: boolean;
  style?: CSSProperties;
}

/** Work-grid tile: image, uppercase caption, black hairline, tech and year. */
export function ProjectCard({ href, title, tech, year, image, priority, style }: ProjectCardProps) {
  // §7's FLIP hand-off starts here: the card's own image sets off toward the detail page's slot,
  // so the rect that matters is this image's, captured at the moment of the click — before
  // RouteTransition's cover animation plays and the grid unmounts. See src/motion/flip.ts and
  // FlipImage (the detail page's half of the same hand-off).
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Not an e.defaultPrevented guard: RouteTransition's own document-capture click handler
    // (see src/motion/RouteTransition.tsx) already calls preventDefault() on every internal
    // link click before this bubble-phase handler ever runs — checking that flag here would
    // make this a no-op on literally every real click. Rect-capture doesn't navigate anything
    // itself, so whether the default was already prevented is irrelevant to it.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const img = e.currentTarget.querySelector("img");
    const slug = href.split("/").filter(Boolean).pop();
    if (!img || !slug) return;
    const rect = img.getBoundingClientRect();
    storeFlipRect(slug, { left: rect.left, top: rect.top, width: rect.width, height: rect.height });
  };
  return (
    <Link href={href} className={styles.card} style={style} onClick={onClick}>
      <div className={styles.media}>
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            // Matches the actual grid (WorkScreen.module.css): 2 columns on mobile (~42vw per
            // card, not full-bleed), 3 columns everywhere else (~31vw). The previous guess
            // (90vw on mobile) told Next to fetch a ~2x-oversized variant — confirmed by
            // Lighthouse's image-delivery audit flagging ~95% of the mobile payload as wasted.
            sizes="(max-width: 767px) 42vw, (max-width: 1113px) 31vw, (max-width: 1920px) 31vw, 602px"
            className={styles.img}
            priority={priority}
          />
        ) : null}
      </div>
      <div className={styles.body}>
        <span className={styles.title}>{title}</span>
        <div className={styles.rule} />
        <div className={styles.meta}>
          <span className={styles.tech}>{tech}</span>
          <span className={styles.year}>{year}</span>
        </div>
      </div>
    </Link>
  );
}
