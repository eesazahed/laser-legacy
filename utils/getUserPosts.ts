import clientPromise from "../lib/mongodb";
import type { Post } from "../types";
import getPostById from "./getPostById";

const getUserPosts = async (_id: string) => {
  try {
    const posts = (await clientPromise).db().collection("posts");

    const userPosts = await posts.find({ senderId: _id }).toArray();

    const postData: Post[] = [];

    for (const postId in userPosts) {
      const thisPost = userPosts[postId];

      const post = (await getPostById(
        thisPost._id.toString()
      )) as unknown as Post;

      postData.push(post);
    }

    const sorted = postData.sort(
      (timestamp1: Post, timestamp2: Post) =>
        timestamp2.timestamp - timestamp1.timestamp
    );

    return sorted;
  } catch {
    return null;
  }
};

export default getUserPosts;
