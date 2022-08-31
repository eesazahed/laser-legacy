import type { NextPage } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Error from "../components/Error";
import PageHead from "../components/PageHead";
import SignedOut from "../components/SignedOut";
import Success from "../components/Success";
import styles from "../styles/Settings.module.css";
import type { FormData, PublicUser, User } from "../types";
import getUserFromSession from "../utils/getUserFromSession";

interface Props {
  user: PublicUser;
}

const Settings: NextPage<Props> = ({ user }) => {
  const { data: session, status } = useSession();

  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: user.name,
    username: user.username,
    bio: user.bio,
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const submitData = async (e: any) => {
    e.preventDefault();

    const request = await fetch("api/users/settings", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    const data = await request.json();

    setMessage(data.message);
    setMessageType(data.type);

    if (data.type === "success") {
      router.push("/");
    }
  };

  return (
    <div className={styles.container}>
      <PageHead title="Settings" />

      {status === "loading" && (
        <main className={styles.main}>
          <p className={styles.description}>Loading...</p>
        </main>
      )}

      {status === "unauthenticated" && <SignedOut />}

      {status === "authenticated" && (
        <main className={styles.main}>
          <h1 className={styles.title}>Settings</h1>

          <p className={styles.description}>
            Hey, {user.username}! Here is where you can choose your account
            preferences.
          </p>

          <form className={styles.form}>
            <label htmlFor="name">Enter your name</label>
            <input
              type="text"
              placeholder="Your name"
              id="name"
              className={styles.input}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            {messageType === "name" && (
              <p>
                <Error text={message} />
              </p>
            )}

            <label htmlFor="username">
              {user.username
                ? "Choose a new username if you want."
                : "Go ahead, choose a username!"}
            </label>
            <input
              type="text"
              placeholder="Username"
              id="username"
              className={styles.input}
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />

            {messageType === "username" && (
              <p>
                <Error text={message} />
              </p>
            )}

            <label htmlFor="bio">
              Share some stuff about yourself{" "}
              <span className={styles.faded}>(optional)</span>
            </label>
            <textarea
              placeholder="Well basically I'm..."
              id="bio"
              className={styles.bio}
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />

            {messageType === "bio" && (
              <p>
                <Error text={message} />
              </p>
            )}

            {["auth", "server", "success"].includes(messageType) ? (
              messageType === "success" ? (
                <p>
                  <Success text={message} />
                </p>
              ) : (
                <p>
                  <Error text={message} />
                </p>
              )
            ) : (
              ""
            )}

            <button className={styles.btn} onClick={submitData}>
              Confirm
            </button>
            <br />
            <button className={styles.btn} onClick={() => signOut()}>
              Sign out
            </button>
          </form>
        </main>
      )}
    </div>
  );
};

export default Settings;

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  let currentUser = null;

  if (session) {
    const user = (await getUserFromSession(context.req)) as unknown as User;

    if (user) {
      currentUser = user.public;
    }
  }

  return {
    props: {
      user: currentUser,
    },
  };
};
