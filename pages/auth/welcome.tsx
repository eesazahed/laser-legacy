import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PageHead from "../../components/PageHead";
import SignedOut from "../../components/SignedOut";
import styles from "../../styles/Welcome.module.css";

const Welcome: NextPage = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    router.push("/settings");
  });

  return (
    <div className={styles.container}>
      <PageHead title="Welcome" />

      {status === "loading" && (
        <main className={styles.main}>
          <p className={styles.description}>Loading...</p>
        </main>
      )}

      {status === "unauthenticated" && <SignedOut />}

      {status === "authenticated" && (
        <main className={styles.main}>
          <h1 className={styles.title}>Welcome</h1>

          <p className={styles.description}>
            Thanks for signing up!{" "}
            <Link href="/settings">
              <a className={styles.link}>Let&apos;s go! &rarr;</a>
            </Link>
          </p>
        </main>
      )}
    </div>
  );
};

export default Welcome;
