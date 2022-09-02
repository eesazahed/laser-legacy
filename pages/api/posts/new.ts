import type { NextApiRequest, NextApiResponse } from "next";
import type { Post, User } from "../../../types";
import clientPromise from "../../../lib/mongodb";
import getUserFromSession from "../../../utils/getUserFromSession";

const Filter = require("bad-words"),
  filter = new Filter();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = (await clientPromise).db().collection("posts");

  if (req.method === "POST") {
    let content = req.body;

    const user = (await getUserFromSession(req)) as unknown as User;

    if (!user) {
      return res.status(401).json({ message: "Invalid Auth", type: "auth" });
    }

    const allPosts = (await db
      .find({ senderId: user._id.toString() })
      .toArray()) as unknown as Post[];

    if (allPosts.length > 0) {
      const lastTime = allPosts.sort(
        (timestamp1: Post, timestamp2: Post) =>
          timestamp2.timestamp - timestamp1.timestamp
      )[0].timestamp;

      if (Date.now() - lastTime < 30000) {
        return res.status(200).json({
          message: "Please wait before posting again.",
          type: "post",
        });
      }
    }

    if (filter.isProfane(content)) {
      return res.status(200).json({
        message: "Please don't use any bad language.",
        type: "post",
      });
    }

    if (content.length <= 10 || content.length > 200) {
      return res.status(401).json({
        message:
          "Please make the length of the post be between 10-200 characters. ",
        type: "post",
      });
    }

    try {
      const time = Date.now();

      const newPost = {
        content: content,
        senderId: user._id.toString(),
        comments: [],
        commentsCount: 0,
        likedUsers: [],
        likedCount: 0,
        timestamp: time,
        type: "default",
      };

      await db.insertOne(newPost);

      return res.status(200).json({
        message: `Posted!`,
        type: "success",
      });
    } catch {
      return res.status(400).json({
        message: "There was an error in uploading your post.",
        type: "server",
      });
    }
  } else {
    return res
      .status(405)
      .json({ message: "Sorry, that method isn't allowed.", type: "server" });
  }
};

export default handler;
