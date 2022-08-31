import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import type { Post, User } from "../../../types";
import getPostById from "../../../utils/getPostById";
import getUserFromSession from "../../../utils/getUserFromSession";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const posts = (await clientPromise).db().collection("posts");
  const users = (await clientPromise).db().collection("users");

  if (req.method === "POST") {
    let postId = req.body;

    const user = (await getUserFromSession(req)) as unknown as User;

    if (!user) {
      return res.status(401).json({ message: "Invalid Auth", type: "auth" });
    }

    const post = (await getPostById(postId)) as unknown as Post;

    if (!post) {
      return res
        .status(400)
        .json({ message: "Post doesn't exist.", type: "server" });
    }

    if (
      !user.public.likedPosts.some(
        (likedPost) => likedPost._id == post._id.toString()
      )
    ) {
      return res.status(200).json({
        message: `You haven't liked this post.`,
        type: "server",
      });
    }

    if (
      !post.likedUsers.some((likedUser) => likedUser._id === user.public._id)
    ) {
      return res.status(200).json({
        message: `You've already liked this post.`,
        type: "server",
      });
    }

    try {
      await posts.updateOne(
        { _id: post._id },
        { $pull: { likedUsers: { _id: user.public._id } } }
      );

      await users.updateOne(
        { _id: user._id },
        { $pull: { "public.likedPosts": { _id: post._id.toString() } } }
      );

      return res.status(200).json({
        likes: post.likedUsers.length - 1,
        message: `You've liked this post.`,
        type: "success",
      });
    } catch {
      return res
        .status(400)
        .json({ message: "Post doesn't exist.", type: "server" });
    }
  }
};

export default handler;
