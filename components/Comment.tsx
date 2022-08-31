import type { NextPage } from "next";
import type { PostComment } from "../types";
import Username from "./Username";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "../styles/Comment.module.css";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useContext, useState } from "react";
import PostContext from "../context/PostContext";
import Error from "./Error";
import Success from "./Success";
import PostReply from "./PostReply";

interface Props {
  comment: PostComment;
}

const Comment: NextPage<Props> = ({ comment }) => {
  const { data: session, status } = useSession();

  const [setReply, showReply] = useState<boolean>(false);
  const [writtenReply, setWriteReply] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("");
  const router = useRouter();

  const Post = useContext(PostContext);

  const replyToComment = async () => {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/reply/new`,
      {
        method: "POST",
        body: JSON.stringify({
          reply: writtenReply,
          commentId: comment._id,
          postId: Post.post?._id,
        }),
      }
    );

    const data = await request.json();

    setMessage(data.message);
    setMessageType(data.type);

    if (data.type === "success") {
      router.reload();
    }

    if (!session) {
      router.push("/auth/signin");
    }
  };

  const deleteComment = async () => {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/comments/delete`,
      {
        method: "DELETE",
        body: comment._id.toString(),
      }
    );

    const data = await request.json();

    if (data.type === "success") {
      router.reload();
    }

    if (!session) {
      router.push("/auth/signin");
    }
  };

  if (Post.post && comment) {
    return (
      <div className={styles.thread} id={comment._id.toString()}>
        <p>
          <b>
            {comment.sender.name} (@
            <Username username={comment.sender.username} />)
          </b>
        </p>
        <div className={styles.content}>
          <ReactMarkdown skipHtml={true}>{comment.content}</ReactMarkdown>
        </div>
        <p>
          <span className={styles.time}>
            {new Date(comment.timestamp).toLocaleString("en-gb")}
          </span>
        </p>
        {Post.user && (
          <div className={styles.reply}>
            <p onClick={() => (setReply ? showReply(false) : showReply(true))}>
              Reply to this comment
            </p>
          </div>
        )}
        {Post.user && setReply && (
          <div className={styles["reply-container"]}>
            <textarea
              className={styles.write}
              placeholder="Write a reply to this comment."
              value={writtenReply}
              onChange={(e) => setWriteReply(e.target.value)}
            ></textarea>

            {messageType === "reply" && (
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

            <button className={styles.post} onClick={replyToComment}>
              Post
            </button>
          </div>
        )}
        {Post.user && Post.user._id === comment.senderId && (
          <div className={styles.delete}>
            <p onClick={deleteComment}>Delete this comment</p>
          </div>
        )}

        {comment.commentRepliesCount > 0 && (
          <details className={styles.details}>
            <summary>View replies ({comment.commentRepliesCount}):</summary>
            {comment.commentReplies.map((commentReply) => {
              return (
                <PostReply
                  key={commentReply._id.toString()}
                  reply={commentReply}
                />
              );
            })}
          </details>
        )}
      </div>
    );
  } else return <></>;
};

export default Comment;
