import type { NextPage } from "next";
import type { Post, TimestampId } from "../types";
import Username from "./Username";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "../styles/UserPost.module.css";
import ReactMarkdown from "react-markdown";

interface Props {
  _id?: string;
  likedPosts?: TimestampId[];
  post: Post;
}

const UserPost: NextPage<Props> = ({ _id, likedPosts, post }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [liked, likePost] = useState<boolean>(
    likedPosts?.some((likedPost) => likedPost._id === post._id.toString()) ||
      false
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
            <ReactMarkdown skipHtml={true}>{post.content}</ReactMarkdown>
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
                _id &&
                post.senderId === _id && (
                  <span
                    onClick={deletePost}
                    className={`${styles.link} ${styles.delete}`}
                  >
                    Delete<i className="bi bi-trash"></i>
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
