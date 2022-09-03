import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import type { Post, TimestampId, User } from "../../../types";
import getPostById from "../../../utils/getPostById";
import getUserFromSession from "../../../utils/getUserFromSession";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    let _id = req.body;

    const user = (await getUserFromSession(req)) as unknown as User;

    if (!user) {
      return res.status(401).json({ message: "Invalid Auth", type: "auth" });
    }

    const post = (await getPostById(_id)) as unknown as Post;

    if (!post) {
      return res
        .status(400)
        .json({ message: "Post doesn't exist", type: "server" });
    }

    if (post.senderId !== user._id.toString()) {
      if (!user.public.admin) {
        return res.status(401).json({ message: "Invalid Auth", type: "auth" });
      }
    }

    const posts = (await clientPromise).db().collection("posts");
    const users = (await clientPromise).db().collection("users");
    const comments = (await clientPromise).db().collection("comments");
    const replies = (await clientPromise).db().collection("replies");

    const allUsers = await users.find({}).toArray();

    try {
      allUsers.forEach((findUser) => {
        findUser.public.likedPosts.forEach(async (likedPost: TimestampId) => {
          if (likedPost._id === _id) {
            await users.updateOne(
              { _id: findUser._id },
              { $pull: { "public.likedPosts": { _id: _id } } }
            );
          }
        });
      });

      await replies.deleteMany({ postId: _id });
      await comments.deleteMany({ postId: _id });
      await posts.deleteOne({ _id: new ObjectId(_id) });

      return res
        .status(200)
        .json({ message: "Post successfully deleted", type: "success" });
    } catch {
      return res
        .status(400)
        .json({ message: "Post could not be deleted", type: "server" });
    }
  } else {
    return res
      .status(405)
      .json({ message: "Sorry, that method isn't allowed.", type: "server" });
  }
};

export default handler;
