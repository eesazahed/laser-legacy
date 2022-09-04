import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PageHead from "../../../components/PageHead";
import Username from "../../../components/Username";
import styles from "../../../styles/Profile.module.css";
import type { Follower } from "../../../types";
import getLikesForPost from "../../../utils/getLikesForPost";

interface Props {
  postId: string;
  likes: Follower[];
}

const Profile: NextPage<Props> = ({ postId, likes }) => {
  const { data: session, status } = useSession();

  return (
    <div className={styles.container}>
      <PageHead title="View Likes" />
      {!likes && (
        <main className={styles.main}>
          <p className={styles.description}>
            This post doesn&apos;t seem to exist.
          </p>
        </main>
      )}
      {!likes && status === "loading" && (
        <main className={styles.main}>
          <p className={styles.description}>Loading...</p>
        </main>
      )}

      {likes && status !== "loading" && (
        <main className={styles.main}>
          <div className={styles.profile}>
            <h1 className={styles.profileTitle}>View Likes</h1>
            <p className={styles.profileDescription}>
              <Link href={`/post/${postId}`}>
                <a>&larr; Back to post</a>
              </Link>
            </p>
            {likes.length === 0 && <p>This post has no likes</p>}
            <ul>
              {likes.map((likedUser: Follower) => {
                return (
                  <li key={likedUser._id}>
                    <p>
                      {likedUser.name} (@
                      <Username username={likedUser.username} />)
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </main>
      )}
    </div>
  );
};

export default Profile;

export const getServerSideProps = async (context: any) => {
  let currentLikes = null;

  const likes = (await getLikesForPost(
    context.params.postId
  )) as unknown as Follower[];

  if (likes) {
    currentLikes = JSON.parse(JSON.stringify(likes));
  }

  return {
    props: {
      postId: context.params.postId,
      likes: currentLikes,
    },
  };
};
