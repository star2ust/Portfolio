import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./PrevNextLink.module.css";

export interface PrevNextLinkProps {
  direction?: "prev" | "next";
  label?: string;
  href: string;
  thumb?: string;
  style?: CSSProperties;
}

/** Project pager: label, a 135px arrow shaft (SVG, not an icon), and an optional 60%-opacity thumbnail. */
export function PrevNextLink({ direction = "next", label, href, thumb, style }: PrevNextLinkProps) {
  const isPrev = direction === "prev";
  const text = label ?? (isPrev ? "Предыдущий" : "Следующий");
  return (
    <Link
      href={href}
      className={`${styles.link} ${isPrev ? styles.prev : styles.next}`}
      style={style}
    >
      <span className={styles.label}>{text}</span>
      <svg width="135" height="9" viewBox="0 0 135 9" className={styles.shaft} aria-hidden="true">
        <path d="M0 4.5 H134 M130.5 1 L134 4.5 L130.5 8" strokeWidth="1" fill="none" />
      </svg>
      {thumb ? (
        <span className={styles.thumbWrap}>
          <Image src={thumb} alt="" fill sizes="135px" className={styles.thumb} />
        </span>
      ) : null}
    </Link>
  );
}
