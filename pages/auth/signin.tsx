import type { NextPage } from "next";
import { getProviders, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import PageHead from "../../components/PageHead";
import styles from "../../styles/Signin.module.css";

interface Props {
  providers: Object;
}

const SignIn: NextPage<Props> = ({ providers }) => {
  const { data: session, status } = useSession();

  return (
    <div className={styles.container}>
      <PageHead title="Sign In" />

      {status === "loading" && (
        <main className={styles.main}>
          <p className={styles.description}>Loading...</p>
        </main>
      )}

      {status === "unauthenticated" && (
        <div className={styles.main}>
          <h1 className={styles.title}>Sign in!</h1>
          <p className={styles.description}>
            Use your Google Account to sign in:
          </p>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className={styles.btn}
                onClick={() => signIn(provider.id)}
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
          <p className={styles.about}>
            By using this platform you must be over the age of <b>13</b>{" "}
            <i>or</i> <b>10 with parental consent</b>. <br />
            <br />
            We use Google authentication as a quick and easy sign-in for users.
            Your email address, name, and photo will never be shared to
            third-parties. If you&apos;d like, you can view our code at{" "}
            <a
              style={{ color: "#0070f3" }}
              target="_blank"
              rel="noreferrer"
              href="https://github.com/eesazahed/"
            >
              <u>https://github.com/eesazahed/</u>
            </a>{" "}
            to view to information we collect.
          </p>
        </div>
      )}

      {status === "authenticated" && (
        <main className={styles.main}>
          <h1 className={styles.title}>Sign in</h1>

          <p className={styles.description}>
            Thanks for signing up!{" "}
            <Link href="/">
              <a className={styles.link}>Let&apos;s go!</a>
            </Link>
          </p>
        </main>
      )}
    </div>
  );
};

export default SignIn;

export const getServerSideProps = async (context: any) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
