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
            sizes="(max-width: 767px) 90vw, (max-width: 1113px) 45vw, 33vw"
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
