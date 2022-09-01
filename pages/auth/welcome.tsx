import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PageHead from "../../components/PageHead";
import styles from "../../styles/Welcome.module.css";

const Welcome: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <div className={styles.container}>
      <PageHead title="Welcome" />
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome</h1>

        <p className={styles.description}>
          Thanks for signing up!{" "}
          <Link href="/">
            <a className={styles.link}>Let&apos;s go! &rarr;</a>
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Welcome;
