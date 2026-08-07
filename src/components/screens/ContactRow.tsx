import styles from "./ContactRow.module.css";

export interface ContactRowProps {
  label?: string;
  value: string;
  href: string;
  mark?: boolean;
}

/** mail / tg / vk / inst — presented as raw data with a small ↗ mark, nothing more. No CTA verbs. */
export function ContactRow({ label, value, href, mark }: ContactRowProps) {
  return (
    <a href={href} className={styles.row} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      <span className={styles.text}>
        {label ? `${label} ` : ""}
        {value}
      </span>
      {mark ? <span className={styles.mark} aria-hidden="true" /> : null}
    </a>
  );
}
