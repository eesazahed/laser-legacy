import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PageHead from "../../components/PageHead";
import styles from "../../styles/Welcome.module.css";

const Welcome: NextPage = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    router.replace(router.asPath);
  }, [router]);

  return (
    <div className={styles.container}>
      <PageHead title="Welcome" />
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome</h1>
        <p className={styles.description}>
          Thanks for signing up!{" "}
          <Link href="/settings">
            <a className={styles.link}>Let&apos;s go! &rarr;</a>
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Welcome;
