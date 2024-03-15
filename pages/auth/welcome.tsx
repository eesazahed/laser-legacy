import type { NextPage } from "next";
import Link from "next/link";
import PageHead from "../../components/PageHead";
import styles from "../../styles/Welcome.module.css";

const Welcome: NextPage = () => {
  return (
    <div className={styles.container}>
      <PageHead title="Welcome" />
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome</h1>
        <p className={styles.description}>
          Thanks for signing up!{" "}
          <a
            href="https://laser-legacy.vercel.app/settings"
            referrerPolicy="no-referrer"
            className={styles.link}
          >
            Let&apos;s go! &rarr;
          </a>
        </p>
      </main>
    </div>
  );
};

export default Welcome;
