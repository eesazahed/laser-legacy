import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Error from "../components/Error";
import Success from "../components/Success";
import styles from "../styles/CommentBox.module.css";

interface Props {
  _id: string;
}

const CommentBox: NextPage<Props> = ({ _id }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [comment, setComment] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("");

  const submitData = async (e: any) => {
    e.preventDefault();

    setMessage("Posting...");
    setMessageType("success");

    const request = await fetch("/api/comments/new", {
      method: "POST",
      body: JSON.stringify({ postId: _id, comment: comment }),
    });

    const data = await request.json();

    setMessage(data.message);
    setMessageType(data.type);

    if (data.type === "success") {
      router.reload();
    }
  };

  return (
    <div className={styles.container}>
      {status === "loading" && <p>Loading...</p>}

      {status === "unauthenticated" && <></>}

      {status === "authenticated" && (
        <form className={styles.form}>
          <label htmlFor="comment">Write a comment: </label>

          <textarea
            placeholder="Comment about this post (please don't be offensive in any way)"
            id="comment"
            className={styles.comment}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {messageType === "comment" && (
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
            Comment!
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentBox;
