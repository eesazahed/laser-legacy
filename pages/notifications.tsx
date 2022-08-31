import type { NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NotificationFeed from "../components/NotificationFeed";
import PageHead from "../components/PageHead";
import SignedOut from "../components/SignedOut";
import styles from "../styles/Notifications.module.css";
import type {
  NotificationData,
  NotificationDataObject,
  PublicUser,
  User,
} from "../types";
import getNotifications from "../utils/getNotifications";
import getUserFromSession from "../utils/getUserFromSession";

interface Props {
  user: PublicUser;
  notifications: NotificationData[] | null;
  unread: number | null;
}

const Notifications: NextPage<Props> = ({ user, notifications, unread }) => {
  const { data: session, status } = useSession();

  const router = useRouter();

  const deleteNofiications = async () => {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/notifications`,
      {
        method: "DELETE",
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

  return (
    <div className={styles.container}>
      <PageHead title="Notifications" />
      {status === "loading" && (
        <main className={styles.main}>
          <p className={styles.description}>Loading...</p>
        </main>
      )}
      {status === "unauthenticated" && <SignedOut />}

      {status === "authenticated" && (
        <main className={styles.main}>
          <h1 className={styles.title}>Notifications</h1>

          {notifications && typeof unread === "number" ? (
            <div className={styles.feed}>
              <p className={styles.description}>
                {notifications.length > 0
                  ? "View your notifications."
                  : "You have no new notifications."}
              </p>

              <button className={styles.delete} onClick={deleteNofiications}>
                Clear notifications <i className="bi bi-trash"></i>
              </button>

              <NotificationFeed notifications={notifications} unread={unread} />
            </div>
          ) : (
            <p className={styles.description}>You have no new notifications.</p>
          )}
        </main>
      )}
    </div>
  );
};

export default Notifications;

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  let currentUser = null;
  let currentNotifications = null;
  let currentUnread = null;

  if (session) {
    const user = (await getUserFromSession(context.req)) as unknown as User;

    if (user) {
      currentUser = user.public;
    }
  }

  const notifications = (await getNotifications(
    context.req
  )) as unknown as NotificationDataObject;

  if (notifications) {
    currentNotifications = notifications.notifications;
    currentUnread = notifications.unread;
  }

  return {
    props: {
      user: currentUser,
      notifications: currentNotifications,
      unread: currentUnread,
    },
  };
};
