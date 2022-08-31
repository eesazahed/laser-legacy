import type { NextApiRequest, NextApiResponse } from "next";
import type { PublicUser, User } from "../../../types";
import clientPromise from "../../../lib/mongodb";
import getUserFromSession from "../../../utils/getUserFromSession";
import getUserById from "../../../utils/getUserById";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const users = (await clientPromise).db().collection("users");
  const notifications = (await clientPromise).db().collection("notifications");

  if (req.method === "POST") {
    let _id = req.body;

    const user = (await getUserFromSession(req)) as unknown as User;

    if (!user) {
      return res.status(401).json({ message: "Invalid Auth", type: "auth" });
    }

    const follow = (await getUserById(_id)) as unknown as PublicUser;

    if (!follow) {
      return res
        .status(400)
        .json({ message: "User doesn't exist.", type: "server" });
    }

    if (user.public._id === follow._id) {
      return res.status(200).json({
        message: `Unable to follow ${follow.username}.`,
        type: "server",
      });
    }

    if (user.public.following.some((follow) => follow._id === _id)) {
      return res.status(200).json({
        message: `You are already following ${follow.username}.`,
        type: "server",
      });
    }

    try {
      const time = Date.now();

      await users.updateOne(
        { email: user.email },
        {
          $inc: { "public.followingCount": 1 },
          $push: {
            "public.following": {
              _id: _id,
              timestamp: time,
            },
          },
        }
      );

      await users.updateOne(
        { "public._id": _id },
        {
          $inc: { "public.followerCount": 1 },
          $push: {
            "public.followers": {
              _id: user.public._id,
              timestamp: time,
            },
          },
        }
      );

      await notifications.updateOne(
        { userId: _id },
        {
          $inc: { unread: 1 },
          $push: {
            newNotifications: {
              userId: user.public._id,
              timestamp: time,
              type: "follow",
            },
          },
        },
        { upsert: true }
      );

      return res.status(200).json({
        followers: follow.followers.length + 1,
        message: `You are now following ${follow.username}.`,
        type: "success",
      });
    } catch {
      return res
        .status(400)
        .json({ message: "User doesn't exist.", type: "server" });
    }
  } else {
    return res
      .status(405)
      .json({ message: "Sorry, that method isn't allowed.", type: "server" });
  }
};

export default handler;
