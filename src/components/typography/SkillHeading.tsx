import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import styles from "./SkillHeading.module.css";

export interface SkillHeadingProps {
  children: ReactNode;
  mark?: boolean;
  style?: CSSProperties;
}

/** 58px skill name + ↗ mark, on a hairline. Heading for the Skills info panel. */
export function SkillHeading({ children, mark = true, style }: SkillHeadingProps) {
  return (
    <div className={styles.wrap} style={style}>
      <div className={styles.row}>
        <h2 className={styles.title}>{children}</h2>
        {mark ? (
          <Image src="/icons/arrow-diagonal.png" alt="" width={35} height={35} className={styles.mark} />
        ) : null}
      </div>
      <div className={styles.rule} />
    </div>
  );
}
