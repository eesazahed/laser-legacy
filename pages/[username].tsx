import type { NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import PageHead from "../components/PageHead";
import UserPost from "../components/UserPost";
import ProfileContext from "../context/ProfileContext";
import styles from "../styles/Profile.module.css";
import type { Post, PublicUser, User } from "../types";
import copy from "../utils/copy";
import getUserByUsername from "../utils/getUserByUsername";
import getUserFromSession from "../utils/getUserFromSession";
import getUserPosts from "../utils/getUserPosts";
import timeAgo from "../utils/timeAgo";

interface Props {
  user: PublicUser;
  profile: PublicUser;
  posts: Post[];
}

const Profile: NextPage<Props> = ({ user, profile, posts }) => {
  const { data: session, status } = useSession();

  const [pageTitle, setPageTitle] = useState<string>("Profile");
  const [followers, setFollowers] = useState<number>(
    profile ? profile.followerCount : 0
  );

  const [isFollowing, startFollowing] = useState<boolean>(
    profile && user
      ? user.following.some((follow) => follow._id === profile._id)
      : false
  );

  useEffect(() => {
    setPageTitle(profile ? profile.name : "Profile");
  }, [profile]);

  const follow = async () => {
    const request = await fetch("/api/users/follow", {
      method: "POST",
      body: profile._id,
    });

    const data = await request.json();

    if (data.type === "success") {
      startFollowing(true);
      setFollowers(followers + 1);
    }
  };

  const unfollow = async () => {
    const request = await fetch("/api/users/unfollow", {
      method: "POST",
      body: profile._id,
    });

    const data = await request.json();

    if (data.type === "success") {
      startFollowing(false);
      setFollowers(followers - 1);
    }
  };

  return (
    <div className={styles.container}>
      <PageHead title={pageTitle} />

      {!profile && (
        <main className={styles.main}>
          <p className={styles.description}>This page could not be found.</p>
        </main>
      )}

      {profile && status === "loading" && (
        <main className={styles.main}>
          <p className={styles.description}>Loading...</p>
        </main>
      )}

      {profile && status !== "loading" && (
        <main className={styles.main}>
          <div className={styles.profile}>
            <h1 className={styles.profileTitle}>{profile.name}</h1>
            <p
              className={styles.profileDescription}
              onClick={() => copy(String(profile.username))}
            >
              @{profile.username}
            </p>
            <div className={styles.btns}>
              <button
                className={styles.copy}
                onClick={() =>
                  copy(`${process.env.NEXT_PUBLIC_URL}/${profile.username}`)
                }
              >
                Copy profile link
              </button>
              {user && user._id !== profile._id && (
                <>
                  {isFollowing ? (
                    <button className={styles.unfollow} onClick={unfollow}>
                      Unfollow
                    </button>
                  ) : (
                    <button className={styles.follow} onClick={follow}>
                      Follow
                    </button>
                  )}
                </>
              )}
            </div>
            <section className={styles.about}>
              <p className={styles.faded}>
                Joined {new Date(profile.joined).toDateString()}
              </p>
              <p className={styles.faded}>
                {timeAgo(profile.lastOnline) === "Just now" ? (
                  <span className={styles.online}>Online</span>
                ) : (
                  <>Last Online {timeAgo(profile.lastOnline)}</>
                )}
              </p>
              <p className={styles.faded}>
                <u>
                  <a href={`/${profile.username}/followers`}>
                    {followers} {followers === 1 ? "Follower" : "Followers"}
                  </a>
                </u>
              </p>
              <p className={styles.faded}>
                <u>
                  <a href={`/${profile.username}/following`}>
                    {profile.followingCount} Following
                  </a>
                </u>
              </p>
              {profile.bio && (
                <div className={styles.bio}>
                  {profile.bio.split("\n").map((text, key) => {
                    return <p key={key}>{text}</p>;
                  })}
                </div>
              )}
            </section>
            {posts.length > 0 ? (
              <div className={styles.feed}>
                <ProfileContext.Provider value={{ user: user }}>
                  {posts.map((post: Post) => {
                    return <UserPost key={post._id.toString()} post={post} />;
                  })}
                </ProfileContext.Provider>
              </div>
            ) : (
              <p>This user no has no posts.</p>
            )}
          </div>
        </main>
      )}
    </div>
  );
};

export default Profile;

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  let currentUser = null;
  let currentPosts = null;

  if (session) {
    const user = (await getUserFromSession(context.req)) as unknown as User;

    if (user) {
      currentUser = user.public;
    }
  }

  if (currentUser && context.params.username === "profile") {
    const posts = (await getUserPosts(currentUser?._id)) as unknown as Post[];

    currentPosts = JSON.parse(JSON.stringify(posts));

    return {
      props: {
        user: currentUser,
        profile: currentUser,
        posts: currentPosts,
      },
    };
  }

  const profile =
    ((await getUserByUsername(context.params.username)) as unknown as User) ||
    null;

  if (profile) {
    const posts = (await getUserPosts(
      profile._id.toString()
    )) as unknown as Post[];

    if (posts) {
      currentPosts = JSON.parse(JSON.stringify(posts));
    }
  }

  return {
    props: {
      user: currentUser,
      profile: profile,
      posts: currentPosts,
    },
  };
};
