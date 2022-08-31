import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "../../../types";
import clientPromise from "../../../lib/mongodb";
import getUserFromSession from "../../../utils/getUserFromSession";

const notAllowedUsernames = [
  "new",
  "settings",
  "post",
  "notifications",
  "auth",
  "profile",
];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = (await clientPromise).db().collection("users");

  if (req.method === "POST") {
    let data = JSON.parse(req.body);

    const user = (await getUserFromSession(req)) as unknown as User;
    const users = await db.find({}).toArray();
    const username = /^[A-Za-z0-9_-]*$/;

    if (!user) {
      return res.status(401).json({ message: "Invalid Auth", type: "auth" });
    }

    if (data.name.length < 4 || data.name.length > 15) {
      return res.status(200).json({
        message: "Please enter a name between 4-15 characters.",
        type: "name",
      });
    }

    if (
      data.username.length < 4 ||
      data.username.length > 15 ||
      !username.test(data.username)
    ) {
      return res.status(200).json({
        message:
          "Usernames can only contain letters, numbers, dashes, and underscores, and must be 4-15 characters in length.",
        type: "username",
      });
    }

    const usernameExists = () => {
      let usernameOwner = users.find(
        (user) =>
          user.public.username.toLowerCase() === data.username.toLowerCase()
      );

      if (usernameOwner?.public._id === user.public._id) {
        // if current user has username
        return false;
      }

      return users.some(
        (user) =>
          user.public.username.toLowerCase() === data.username.toLowerCase()
      );
    };

    if (
      usernameExists() ||
      notAllowedUsernames.includes(data.username.toLowerCase())
    ) {
      return res.status(200).json({
        message: `Username "${data.username}" is unavailable.`,
        type: "username",
      });
    }

    if (data.bio.length > 200) {
      return res.status(200).json({
        message: "Bio must be under 200 characters..",
        type: "bio",
      });
    }

    await db
      .updateOne(
        { email: user.email },
        {
          $set: {
            "public.name": data.name,
            "public.username": data.username,
            "public.bio": data.bio,
          },
        }
      )
      .then(() => {
        return res.status(200).json({
          message: "Your settings have been successfully updated!",
          type: "success",
        });
      })
      .catch(() => {
        return res
          .status(400)
          .json({ message: "User doesn't exist.", type: "server" });
      });
  } else {
    return res
      .status(405)
      .json({ message: "Sorry, that method isn't allowed.", type: "server" });
  }
};

export default handler;
