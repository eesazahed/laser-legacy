import type { NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Comment from "../../components/Comment";
import CommentBox from "../../components/CommentBox";
import PageHead from "../../components/PageHead";
import UserPost from "../../components/UserPost";
import PostContext from "../../context/PostContext";
import ProfileContext from "../../context/ProfileContext";
import styles from "../../styles/Post.module.css";
import type { Post, PublicUser, User } from "../../types";
import copy from "../../utils/copy";
import getPostById from "../../utils/getPostById";
import getUserFromSession from "../../utils/getUserFromSession";

interface Props {
  user: PublicUser;
  post: Post;
}

const Profile: NextPage<Props> = ({ user, post }) => {
  const { data: session, status } = useSession();

  return (
    <div className={styles.container}>
      <PageHead title="Post" />

      {!post && (
        <main className={styles.main}>
          <p className={styles.description}>
            This post doesn&apos;t seem to exist.
          </p>
        </main>
      )}

      {post && status === "loading" && (
        <main className={styles.main}>
          <p className={styles.description}>Loading...</p>
        </main>
      )}

      {post && status !== "loading" && (
        <PostContext.Provider value={{ user: user, post: post }}>
          <main className={styles.main}>
            <div className={styles.post}>
              <ProfileContext.Provider value={{ user: user }}>
                <UserPost post={post} key={post._id.toString()} />
              </ProfileContext.Provider>
              <button
                className={styles.copy}
                onClick={() =>
                  copy(
                    `${process.env.NEXT_PUBLIC_URL}/post/${post._id.toString()}`
                  )
                }
              >
                Copy link
              </button>
              <br />
              <br />
              {user && <CommentBox _id={post._id.toString()} />}
              <br />
              {post.comments && (
                <div className={styles.comments}>
                  <p>Comments ({post.commentsCount}):</p>
                  {post.comments.map((comment) => {
                    return (
                      <Comment key={comment._id.toString()} comment={comment} />
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </PostContext.Provider>
      )}
    </div>
  );
};

export default Profile;

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  let currentUser = null;
  let currentPost = null;

  if (session) {
    const user = (await getUserFromSession(context.req)) as unknown as User;

    if (user) {
      currentUser = user.public;
    }
  }

  const post = (await getPostById(context.params.postId)) as unknown as Post;

  if (post) {
    currentPost = JSON.parse(JSON.stringify(post));
  }

  return {
    props: {
      user: currentUser,
      post: currentPost,
    },
  };
};
