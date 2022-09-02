import type { NextApiRequest, NextApiResponse } from "next";
import type { Post, PostComment, Reply, User } from "../../../types";
import clientPromise from "../../../lib/mongodb";
import getUserFromSession from "../../../utils/getUserFromSession";
import getCommentById from "../../../utils/getCommentById";
import getPostById from "../../../utils/getPostById";
import getReplyById from "../../../utils/getReplyById";

const Filter = require("bad-words"),
  filter = new Filter();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = (await clientPromise).db().collection("replies");
  const comments = (await clientPromise).db().collection("comments");
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

    const allReplies = (await db
      .find({ senderId: user._id.toString() })
      .toArray()) as unknown as Reply[];

    if (allReplies.length > 0) {
      const lastTime = allReplies.sort(
        (timestamp1: Reply, timestamp2: Reply) =>
          timestamp2.timestamp - timestamp1.timestamp
      )[0].timestamp;

      if (Date.now() - lastTime < 10000) {
        return res.status(200).json({
          message: "Please wait before replying again.",
          type: "reply",
        });
      }
    }

    if (filter.isProfane(data.reply)) {
      return res.status(200).json({
        message: "Please don't use any bad language.",
        type: "server",
      });
    }

    if (data.parentId) {
      const reply = (await getReplyById(data.parentId)) as unknown as Reply;

      if (!reply) {
        return res
          .status(401)
          .json({ message: "Reply doesn't exist", type: "server" });
      }

      if (data.reply.length <= 0 || data.reply.length > 100) {
        return res.status(401).json({
          message:
            "Please make the length of the reply be between 0-100 characters. ",
          type: "reply",
        });
      }

      const time = Date.now();

      const newReply = {
        content: data.reply,
        senderId: user._id.toString(),
        postId: reply.postId,
        postSenderId: reply.postSenderId,
        parentId: reply._id.toString(),
        parentSender: reply.senderId,
        replyReplies: [],
        replyRepliesCount: 0,
        timestamp: time,
      };

      try {
        await db.insertOne(newReply).then(async (result) => {
          await db.updateOne(
            { _id: reply._id },
            {
              $inc: { replyRepliesCount: 1 },
              $push: {
                replyReplies: {
                  _id: result.insertedId.toString(),
                  timestamp: time,
                },
              },
            }
          );

          if (user.public._id !== reply.senderId) {
            await notifications.updateOne(
              { userId: reply.senderId },
              {
                $inc: { unread: 1 },
                $push: {
                  newNotifications: {
                    userId: user.public._id,
                    postId: post._id.toString(),
                    replyId: result.insertedId.toString(),
                    timestamp: time,
                    type: "replyToReply",
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
    } else if (data.commentId) {
      const comment = (await getCommentById(
        data.commentId
      )) as unknown as PostComment;

      if (!comment) {
        return res
          .status(401)
          .json({ message: "Comment doesn't exist", type: "server" });
      }

      if (data.reply.length <= 0 || data.reply.length > 100) {
        return res.status(401).json({
          message:
            "Please make the length of the reply be between 0-100 characters. ",
          type: "reply",
        });
      }

      const time = Date.now();

      const newReply = {
        content: data.reply,
        senderId: user._id.toString(),
        postId: comment.postId,
        postSenderId: comment.postSenderId,
        parentId: comment._id.toString(),
        parentSender: comment.senderId,
        replyReplies: [],
        replyRepliesCount: 0,
        timestamp: time,
      };

      try {
        await db.insertOne(newReply).then(async (result) => {
          await comments.updateOne(
            { _id: comment._id },
            {
              $inc: { commentRepliesCount: 1 },
              $push: {
                commentReplies: {
                  _id: result.insertedId.toString(),
                  timestamp: time,
                },
              },
            }
          );

          if (user.public._id !== comment.senderId) {
            await notifications.updateOne(
              { userId: comment.senderId },
              {
                $inc: { unread: 1 },
                $push: {
                  newNotifications: {
                    userId: user.public._id,
                    postId: post._id.toString(),
                    replyId: result.insertedId.toString(),
                    timestamp: time,
                    type: "replyToComment",
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
