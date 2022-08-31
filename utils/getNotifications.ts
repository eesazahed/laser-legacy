import clientPromise from "../lib/mongodb";
import {
  BasicUserProfile,
  NewNotification,
  NotificationData,
  Notifications,
  User,
} from "../types";
import getBasicUserProfile from "./getBasicUserProfile";
import getUserFromSession from "./getUserFromSession";

const getNotifications = async (req: any) => {
  try {
    const user = (await getUserFromSession(req)) as unknown as User;

    const notifications = (await clientPromise)
      .db()
      .collection("notifications");

    const notification = (await notifications.findOne({
      userId: user?._id.toString(),
    })) as unknown as Notifications;

    const unreadNotifications = notification.unread;
    const newNotifications: NewNotification[] = notification.newNotifications;

    const notificationData: NotificationData[] = [];

    for (const newNotificationId in newNotifications) {
      const newNotification = newNotifications[newNotificationId];

      const user = (await getBasicUserProfile(
        newNotification.userId
      )) as unknown as BasicUserProfile;

      notificationData.push({
        ...user,
        type: newNotification.type,
        timestamp: newNotification.timestamp,
        postId: newNotification.postId || null,
        commentId: newNotification.commentId || null,
        replyId: newNotification.replyId || null,
      });
    }

    let sorted = notificationData.sort(
      (timestamp1: NotificationData, timestamp2: NotificationData) =>
        timestamp2.timestamp - timestamp1.timestamp
    );

    await notifications.updateOne(
      { userId: user.public._id },
      { $set: { unread: 0 } }
    );

    return {
      notifications: sorted,
      unread: unreadNotifications,
    };
  } catch {
    return null;
  }
};

export default getNotifications;
