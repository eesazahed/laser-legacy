import type { NextPage } from "next";
import type { NotificationData } from "../types";
import timeAgo from "../utils/timeAgo";
import Username from "./Username";
import styles from "../styles/NotificationFeed.module.css";
import Link from "next/link";

interface Props {
  notifications: NotificationData[];
  unread: number;
}

const NotificationFeed: NextPage<Props> = ({ notifications, unread }) => {
  return (
    <ul className={styles.container}>
      {notifications &&
        notifications
          .slice(0, unread)
          .map((notification: NotificationData, index: number) => {
            return (
              <li
                className={`${styles.notification} ${styles.unread}`}
                key={index}
              >
                <span className={styles.message}>
                  {notification.name} (@
                  <Username username={notification.username} />){" "}
                  {notification.type === "like" && (
                    <>
                      liked your{" "}
                      <Link href={`/post/${notification.postId}`}>
                        <a className={styles.link}>post</a>
                      </Link>
                      .
                    </>
                  )}
                  {notification.type === "follow" && "started following you."}
                  {notification.type === "comment" && (
                    <>
                      commented on your{" "}
                      <Link
                        scroll={false}
                        href={`/post/${notification.postId}#${notification.commentId}`}
                      >
                        <a className={styles.link}>post</a>
                      </Link>
                      .
                    </>
                  )}
                  {notification.type === "replyToComment" && (
                    <>
                      replied to your{" "}
                      <Link
                        scroll={false}
                        href={`/post/${notification.postId}#${notification.replyId}`}
                      >
                        <a className={styles.link}>comment</a>
                      </Link>
                      .
                    </>
                  )}
                  {notification.type === "replyToReply" && (
                    <>
                      replied to your{" "}
                      <Link
                        scroll={false}
                        href={`/post/${notification.postId}#${notification.replyId}`}
                      >
                        <a className={styles.link}>reply</a>
                      </Link>
                      .
                    </>
                  )}
                </span>
                <span className={styles.time}>
                  {timeAgo(notification.timestamp)}
                </span>
              </li>
            );
          })}
      {notifications &&
        notifications
          .slice(unread)
          .map((notification: NotificationData, index: number) => {
            return (
              <li className={styles.notification} key={index}>
                <span className={styles.message}>
                  {notification.name} (@
                  <Username username={notification.username} />){" "}
                  {notification.type === "like" && (
                    <>
                      liked your{" "}
                      <Link href={`/post/${notification.postId}`}>
                        <a className={styles.link}>post</a>
                      </Link>
                      .
                    </>
                  )}
                  {notification.type === "follow" && "started following you."}
                  {notification.type === "comment" && (
                    <>
                      commented on your{" "}
                      <Link
                        scroll={false}
                        href={`/post/${notification.postId}#${notification.commentId}`}
                      >
                        <a className={styles.link}>post</a>
                      </Link>
                      .
                    </>
                  )}
                  {notification.type === "replyToComment" && (
                    <>
                      replied to your{" "}
                      <Link
                        scroll={false}
                        href={`/post/${notification.postId}#${notification.replyId}`}
                      >
                        <a
                          href={`/post/${notification.postId}#${notification.commentId}`}
                          className={styles.link}
                        >
                          comment
                        </a>
                      </Link>
                      .
                    </>
                  )}
                  {notification.type === "replyToReply" && (
                    <>
                      replied to your{" "}
                      <Link
                        scroll={false}
                        href={`/post/${notification.postId}#${notification.replyId}`}
                      >
                        <a className={styles.link}>reply</a>
                      </Link>
                      .
                    </>
                  )}
                </span>
                <span className={styles.time}>
                  {timeAgo(notification.timestamp)}
                </span>
              </li>
            );
          })}
    </ul>
  );
};

export default NotificationFeed;
