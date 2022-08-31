import type { NextApiRequest, NextApiResponse } from "next";
import type { Post, User } from "../../../types";
import clientPromise from "../../../lib/mongodb";
import getUserFromSession from "../../../utils/getUserFromSession";
import getPostById from "../../../utils/getPostById";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = (await clientPromise).db().collection("comments");
  const posts = (await clientPromise).db().collection("posts");
  const notifications = (await clientPromise).db().collection("notifications");

  if (req.method === "POST") {
    let data = JSON.parse(req.body);

    const user = (await getUserFromSession(req)) as unknown as User;

    if (!user) {
      return res.status(401).json({ message: "Invalid Auth", type: "auth" });
    }

    const post = (await getPostById(data.postId)) as unknown as Post;

    if (!post) {
      return res
        .status(401)
        .json({ message: "Post doesn't exist", type: "server" });
    }

    if (data.comment.length <= 0 || data.comment.length > 100) {
      return res.status(401).json({
        message:
          "Please make the length of the comment be between 0-100 characters. ",
        type: "comment",
      });
    }

    try {
      const time = Date.now();

      const newComment = {
        content: data.comment,
        postId: post._id.toString(),
        postSenderId: post.senderId,
        senderId: user._id.toString(),
        commentReplies: [],
        commentRepliesCount: 0,
        timestamp: time,
      };

      await db.insertOne(newComment).then(async (result) => {
        await posts.updateOne(
          { _id: post._id },
          {
            $inc: { commentsCount: 1 },
          }
        );

        if (user.public._id !== post.senderId) {
          await notifications.updateOne(
            { userId: post.senderId },
            {
              $inc: { unread: 1 },
              $push: {
                newNotifications: {
                  userId: user.public._id,
                  postId: post._id.toString(),
                  commentId: result.insertedId.toString(),
                  timestamp: time,
                  type: "comment",
                },
              },
            },
            { upsert: true }
          );
        }
      });

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
