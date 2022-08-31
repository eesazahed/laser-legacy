import type { NextPage } from "next";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const SignedOut: NextPage = () => {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Welcome to LaserSocial</h1>

      <p className={styles.description}>A new social media platform.</p>

      <div className={styles.grid}>
        <Link href="auth/signin">
          <a className={`${styles.card} ${styles.login}`}>
            <h2>Sign up now! &rarr;</h2>
            <p>Get started and create an account.</p>
          </a>
        </Link>
        <Link href="/about">
          <a className={styles.card}>
            <h2>Learn more &rarr;</h2>
            <p>Learn more about this platform!</p>
          </a>
        </Link>
      </div>
    </main>
  );
};

export default SignedOut;
