import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.content}>
      <div className={styles.content__subtitle}>
        <span>Mind Maps for Developers</span>
      </div>
      <div className={styles.content__title}>
        <Image
          src="/images/MindSpaceText.png"
          width={1037}
          height={195}
          alt="logo"
        />
      </div>

      <Link href="/map">
        <button className={styles.content__button}>EXPLORE</button>
      </Link>
    </div>
  );
}
