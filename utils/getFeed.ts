import clientPromise from "../lib/mongodb";
import type { Post, User } from "../types";
import getPostById from "./getPostById";
import getUserFromSession from "./getUserFromSession";

const getFeed = async (req: any) => {
  try {
    const user = (await getUserFromSession(req)) as unknown as User;
    const followings = user.public.following;
    const followingData: Post[] = [];

    const posts = (await clientPromise).db().collection("posts");

    for (const followingId in followings) {
      const thisFollowing = followings[followingId];

      const userPosts = await posts
        .find({ senderId: thisFollowing._id })
        .toArray();

      for (const postId in userPosts) {
        const thisPost = userPosts[postId];

        const post = (await getPostById(
          thisPost._id.toString()
        )) as unknown as Post;

        followingData.push(post);
      }
    }

    const sorted = followingData.sort(
      (timestamp1: Post, timestamp2: Post) =>
        timestamp2.timestamp - timestamp1.timestamp
    );

    return sorted;
  } catch {
    return null;
  }
};

export default getFeed;
