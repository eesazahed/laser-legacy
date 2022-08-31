import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import type { PostComment, User } from "../../../types";
import getCommentById from "../../../utils/getCommentById";
import getUserFromSession from "../../../utils/getUserFromSession";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    let _id = req.body;

    const user = (await getUserFromSession(req)) as unknown as User;

    if (!user) {
      return res.status(401).json({ message: "Invalid Auth", type: "auth" });
    }

    const comment = (await getCommentById(_id)) as unknown as PostComment;

    if (!comment) {
      return res
        .status(400)
        .json({ message: "Comment doesn't exist", type: "server" });
    }
    if (!user.public.admin || comment.senderId !== user._id.toString()) {
      return res.status(401).json({ message: "Invalid Auth", type: "auth" });
    }

    const posts = (await clientPromise).db().collection("posts");
    const comments = (await clientPromise).db().collection("comments");
    const replies = (await clientPromise).db().collection("replies");

    try {
      await posts.updateOne(
        { _id: new ObjectId(comment.postId) },
        {
          $pull: { comments: { _id: comment._id.toString() } },
          $inc: { commentsCount: -1 },
        }
      );

      await replies.deleteMany({ parentId: _id });
      await comments.deleteOne({ _id: new ObjectId(_id) });

      return res
        .status(200)
        .json({ message: "Comment successfully deleted", type: "success" });
    } catch {
      return res
        .status(400)
        .json({ message: "Comment could not be deleted", type: "server" });
    }
  } else {
    return res
      .status(405)
      .json({ message: "Sorry, that method isn't allowed.", type: "server" });
  }
};

export default handler;
