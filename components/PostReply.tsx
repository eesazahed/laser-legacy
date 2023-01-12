import type { NextPage } from "next";
import type { Reply } from "../types";
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

interface Props {
  reply: Reply;
}

const PostReply: NextPage<Props> = ({ reply }) => {
  const { data: session, status } = useSession();

  const [setReply, showReply] = useState<boolean>(false);
  const [writtenReply, setWriteReply] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("");
  const router = useRouter();

  const Post = useContext(PostContext);

  const replyToReply = async () => {
    setMessage("Posting...");
    setMessageType("success");

    const request = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/reply/new`,
      {
        method: "POST",
        body: JSON.stringify({
          reply: writtenReply,
          parentId: reply._id,
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

  const deleteReply = async () => {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/reply/delete`,
      {
        method: "DELETE",
        body: reply._id.toString(),
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

  if (Post.post && reply) {
    return (
      <div className={styles.thread} id={reply._id.toString()}>
        <p>
          <b>
            {reply.sender.name} (@
            <Username username={reply.sender.username} />)
          </b>
        </p>

        <div className={styles.content}>
          {reply.content.split("\n").map((text, key) => {
            return <p key={key}>{text}</p>;
          })}
        </div>

        <p>
          <span className={styles.time}>
            {new Date(reply.timestamp).toLocaleString("en-gb")}
          </span>
        </p>

        {Post.user && (
          <div className={styles.reply}>
            <p onClick={() => (setReply ? showReply(false) : showReply(true))}>
              Reply
            </p>
          </div>
        )}

        {Post.user && setReply && (
          <div className={styles["reply-container"]}>
            <textarea
              className={styles.write}
              placeholder="Write a reply."
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

            <button className={styles.post} onClick={replyToReply}>
              Post
            </button>
          </div>
        )}

        {Post.user && (Post.user.admin || Post.user._id === reply.senderId) && (
          <div className={styles.delete}>
            <p onClick={deleteReply}>Delete this reply</p>
          </div>
        )}

        {reply.replyRepliesCount > 0 && (
          <details
            className={styles.details}
            open={router.asPath.split("#")[1] === "630d5003e4c47784cc8f9fdc"}
          >
            <summary>View replies ({reply.replyRepliesCount}):</summary>
            {reply.replyReplies.map((replyReply) => {
              return (
                <PostReply key={replyReply._id.toString()} reply={replyReply} />
              );
            })}
          </details>
        )}
      </div>
    );
  } else return <></>;
};

export default PostReply;
