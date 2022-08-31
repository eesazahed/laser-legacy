import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import type { PostComment, Reply, User } from "../../../types";
import getCommentById from "../../../utils/getCommentById";
import getReplyById from "../../../utils/getReplyById";
import getUserFromSession from "../../../utils/getUserFromSession";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    let _id = req.body;

    const user = (await getUserFromSession(req)) as unknown as User;

    if (!user) {
      return res.status(401).json({ message: "Invalid Auth", type: "auth" });
    }

    const reply = (await getReplyById(_id)) as unknown as Reply;

    if (!reply) {
      return res
        .status(400)
        .json({ message: "Reply doesn't exist", type: "server" });
    }

    if (reply.senderId !== user._id.toString()) {
      return res.status(401).json({ message: "Invalid Auth", type: "auth" });
    }

    const comments = (await clientPromise).db().collection("comments");
    const replies = (await clientPromise).db().collection("replies");

    try {
      const parent = (await getCommentById(
        reply.parentId
      )) as unknown as PostComment;

      if (parent) {
        await comments.updateOne(
          { _id: new ObjectId(reply.parentId) },
          {
            $pull: {
              commentReplies: { _id: reply._id.toString() },
            },
            $inc: { commentRepliesCount: -1 },
          }
        );
      } else {
        await replies.updateOne(
          { _id: new ObjectId(reply.parentId) },
          {
            $pull: {
              replyReplies: { _id: reply._id.toString() },
            },
            $inc: { replyRepliesCount: -1 },
          }
        );
      }

      await replies.deleteMany({ parentId: _id });

      return res
        .status(200)
        .json({ message: "Reply successfully deleted", type: "success" });
    } catch {
      return res
        .status(400)
        .json({ message: "Reply could not be deleted", type: "server" });
    }
  } else {
    return res
      .status(405)
      .json({ message: "Sorry, that method isn't allowed.", type: "server" });
  }
};

export default handler;
