import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
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
  return (
    <Link href={href} className={styles.card} style={style}>
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
