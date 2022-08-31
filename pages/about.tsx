import type { NextPage } from "next";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const About: NextPage = () => {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>LaserSocial</h1>

      <p className={styles.description}>
        An open-source social media platform.
      </p>

      <p className={styles.about}>
        Our goal is to be an open-source social media platform for people to
        share their thoughts and ideas. This platform (made with Next.js and
        Typescript) originally started off as a side project by{" "}
        <a
          style={{ color: "#0070f3" }}
          target="_blank"
          rel="noreferrer"
          href="https://eesa.zahed.ca"
        >
          <u>Eesa Zahed</u>
        </a>
        , and developement began during the summer of 2022.
        <br />
        <br />
        Our mission is to create a place where people can enjoy other
        users&apos; posts without tracking, suggestions, or ads. This site is
        free for anyone, anywhere to use without distraction.
        <br />
        <br />
        Would you like to contribute to this site? Any help would be greatly
        appreciated. It would be preferable if you had experience with{" "}
        <b>Next.js</b>, <b>Typescript</b>, and <b>Mongdb</b>. Our github
        repository is available at{" "}
        <a
          style={{ color: "#0070f3" }}
          target="_blank"
          rel="noreferrer"
          href="https://github.com/eesazahed/"
        >
          <u>https://github.com/eesazahed/</u>
        </a>
        .
        <br />
        <br />
        Sign up now if your ready! If not, then don&apos;t worry. Humans have
        survived millions of years without the need for social media, so
        I&apos;m sure you&apos;ll be fine if you&apos;d prefer not to.
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
