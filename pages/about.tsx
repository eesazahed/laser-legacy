import type { NextPage } from "next";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const About: NextPage = () => {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>LaserSocial</h1>

      <p className={styles.description}>A new social media platform.</p>

      <p className={styles.about}>
        This platform is supposed to be a place where people can enjoy other
        users&apos; posts without tracking or ads. This site is free for anyone,
        anywhere to use without distraction.
      </p>

      <div className={styles.grid}>
        <Link href="auth/signin">
          <a className={`${styles.card} ${styles.login}`}>
            <h2>Sign up now! &rarr;</h2>
            <p>Get started and create an account.</p>
          </a>
        </Link>
      </div>
    </main>
  );
};

export default About;
