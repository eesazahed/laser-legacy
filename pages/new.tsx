import type { NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Error from "../components/Error";
import PageHead from "../components/PageHead";
import SignedOut from "../components/SignedOut";
import Success from "../components/Success";
import styles from "../styles/New.module.css";
import type { PublicUser, User } from "../types";
import getUserFromSession from "../utils/getUserFromSession";

interface Props {
  user: PublicUser;
}

const New: NextPage<Props> = ({ user }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [postContent, setPostContent] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("");

  const submitData = async (e: any) => {
    e.preventDefault();

    const request = await fetch("/api/posts/new", {
      method: "POST",
      body: postContent,
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
      <PageHead title="New" />

      {status === "loading" && (
        <main className={styles.main}>
          <p className={styles.description}>Loading...</p>
        </main>
      )}

      {status === "unauthenticated" && <SignedOut />}

      {status === "authenticated" && (
        <main className={styles.main}>
          <h1 className={styles.title}>New</h1>

          <p className={styles.description}>
            Hey, {user.username}, here is where you can create a post.
          </p>
          <form className={styles.form}>
            <label htmlFor="new">Write something (markdown supported)</label>
            <textarea
              placeholder="What's up?"
              id="new"
              className={styles.new}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />

            {messageType === "post" && (
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
              Post!
            </button>
          </form>
        </main>
      )}
    </div>
  );
};

export default New;

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
