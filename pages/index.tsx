import type { NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import PageHead from "../components/PageHead";
import SignedOut from "../components/SignedOut";
import Username from "../components/Username";
import UserPost from "../components/UserPost";
import styles from "../styles/Home.module.css";
import type { BasicUserProfile, Post, PublicUser, User } from "../types";
import getFeed from "../utils/getFeed";
import getSuggestedProfiles from "../utils/getSuggestedProfiles";
import getUserFromSession from "../utils/getUserFromSession";
import greeting from "../utils/greeting";

interface Props {
  user: PublicUser;
  feed: Post[];
  suggested: BasicUserProfile[];
}

const Home: NextPage<Props> = ({ user, feed, suggested }) => {
  const { data: session, status } = useSession();

  return (
    <div className={styles.container}>
      <PageHead title="Home" />

      {status === "loading" && (
        <main className={styles.main}>
          <p className={styles.description}>Loading...</p>
        </main>
      )}

      {status === "unauthenticated" && <SignedOut />}

      {status === "authenticated" && (
        <main className={styles.main}>
          <h1 className={styles.title}>
            {greeting()}, {user.username}.
          </h1>

          {suggested && suggested.length > 0 && (
            <div className={styles.feed}>
              <p className={styles.description}>Suggested users:</p>
              {suggested.map((suggestedUser: BasicUserProfile) => {
                return (
                  <p key={suggestedUser._id}>
                    {suggestedUser.name} (@
                    <Username username={suggestedUser.username} />)
                  </p>
                );
              })}
            </div>
          )}

          {feed && feed.length > 0 ? (
            <div className={styles.feed}>
              <p className={styles.description}>
                Latest posts from people you&apos;re following 😎
              </p>
              {feed.map((post: Post) => {
                return (
                  <UserPost
                    likedPosts={user.likedPosts}
                    post={post}
                    key={post._id.toString()}
                  />
                );
              })}
            </div>
          ) : (
            <p className={styles.description}>
              You have nothing on your feed 🫤
              <br /> Maybe follow some more people?
            </p>
          )}
        </main>
      )}
    </div>
  );
};

export default Home;

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  let currentUser = null;
  let currentFeed = null;
  let currentSuggested = null;

  if (session) {
    const user = (await getUserFromSession(context.req)) as unknown as User;
    const feed = await getFeed(context.req);
    const suggested = await getSuggestedProfiles();

    if (user) {
      currentUser = user.public;
      currentFeed = JSON.parse(JSON.stringify(feed));
      currentSuggested = suggested;
    }
  }

  return {
    props: {
      user: currentUser,
      feed: currentFeed,
      suggested: currentSuggested,
    },
  };
};
