import clsx from "clsx";
import styles from "./styles.module.css";

export function BrowserWindow({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.row}>
        <div className={clsx(styles.column, styles.left, "space-x-2")}>
          <span className={styles.dot} style={{ background: "#ED594A" }}></span>
          <span className={styles.dot} style={{ background: "#FDD800" }}></span>
          <span className={styles.dot} style={{ background: "#5AC05A" }}></span>
        </div>
        <div className={clsx(styles.column, styles.middle)}>
          <input
            className={styles.searchbar}
            type="text"
            value="https://www.tryabby.com"
            disabled
          />
        </div>
        <div className={clsx(styles.column, styles.right)}>
          <div style={{ float: "right" }}>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </div>
        </div>
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  );
}
