import type { NextApiRequest, NextApiResponse } from "next";
import type { Notifications, User } from "../../types";
import clientPromise from "../../lib/mongodb";
import getUserFromSession from "../../utils/getUserFromSession";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = (await clientPromise).db().collection("notifications");

  const user = (await getUserFromSession(req)) as unknown as User;

  if (!user) {
    return res.status(401).json({ message: "Invalid Auth", type: "auth" });
  }

  if (req.method === "GET") {
    try {
      const userNotifications = (await db.findOne({
        userId: user.public._id,
      })) as Notifications;

      return res.status(200).json(userNotifications.unread);
    } catch {
      return res.status(200).json({
        message: "There was an error fetching notifications.",
        type: "server",
      });
    }
  } else if (req.method === "DELETE") {
    try {
      await db.deleteOne({ userId: user.public._id });

      return res.status(200).json({
        message: "Notifications cleared.",
        type: "success",
      });
    } catch {
      return res.status(200).json({
        message: "There was an error fetching notifications.",
        type: "server",
      });
    }
  } else {
    return res
      .status(405)
      .json({ message: "Sorry, that method isn't allowed." });
  }
};

export default handler;
