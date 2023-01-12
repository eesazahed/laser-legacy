import type { NextPage } from "next";
import type { Post } from "../types";
import Username from "./Username";
import { useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "../styles/UserPost.module.css";
import ReactMarkdown from "react-markdown";
import ProfileContext from "../context/ProfileContext";

interface Props {
  post: Post;
}

const UserPost: NextPage<Props> = ({ post }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const Profile = useContext(ProfileContext);

  const [liked, likePost] = useState<boolean>(
    Profile.user?.likedPosts?.some(
      (likedPost) => likedPost._id === post._id.toString()
    ) || false
  );
  const [likes, setLikes] = useState<number>(post.likedUsers.length);

  const like = async () => {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/posts/like`,
      {
        method: "POST",
        body: post._id.toString(),
      }
    );

    const data = await request.json();

    if (!session) {
      router.push("/auth/signin");
    }

    if (data.type === "success") {
      setLikes(data.likes);
      likePost(true);
    }
  };

  const unlike = async () => {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/posts/unlike`,
      {
        method: "POST",
        body: post._id.toString(),
      }
    );

    const data = await request.json();

    if (!session) {
      router.push("/auth/signin");
    }

    if (data.type === "success") {
      setLikes(data.likes);
      likePost(false);
    }
  };

  const deletePost = async () => {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/posts/delete`,
      {
        method: "DELETE",
        body: post._id.toString(),
      }
    );

    const data = await request.json();

    if (data.type === "success") {
      router.push("/");
    }

    if (!session) {
      router.push("/auth/signin");
    }
  };

  if (post) {
    return (
      <div id={post._id.toString()} className={styles.container}>
        <div className={styles.post}>
          <div className={styles.sender}>
            <p className={styles.name}>
              {post.sender.name} (@
              <Username username={post.sender.username} />)
            </p>
          </div>
          <div className={styles.content}>
            {post.content.split("\n").map((text, key) => {
              return <p key={key}>{text}</p>;
            })}
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles["footer-options"]}>
            <p className={styles.info}>
              <span className={styles.time}>
                {new Date(post.timestamp).toLocaleString("en-gb")}
              </span>
              <span className={styles.likes}>
                {liked ? (
                  <i
                    onClick={unlike}
                    className={`${styles.unlike} bi bi-heart-fill`}
                  ></i>
                ) : (
                  <i
                    onClick={like}
                    className={`${styles.like} bi bi-heart`}
                  ></i>
                )}
                <a href={`/post/${post._id.toString()}/likes`}>{likes}</a>
              </span>
              {router.asPath.includes("/post/") ? (
                Profile.user &&
                (post.senderId === Profile.user._id || Profile.user.admin) && (
                  <span
                    onClick={deletePost}
                    className={`${styles.link} ${styles.delete}`}
                  >
                    Delete
                  </span>
                )
              ) : (
                <span className={styles.link}>
                  <a href={`/post/${post._id.toString()}`}>View Post</a>
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  } else return <></>;
};

export default UserPost;
