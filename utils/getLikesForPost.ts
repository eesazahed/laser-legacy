import type { Follower, Post, BasicUserProfile, TimestampId } from "../types";
import getPostById from "./getPostById";
import getBasicUserProfile from "./getBasicUserProfile";

const getLikesForPost = async (_id: string) => {
  try {
    const post = (await getPostById(_id)) as unknown as Post;

    const likedUsers = post.likedUsers;

    const likedUserData: Follower[] = [];

    for (const likedUserId in likedUsers) {
      const thisLikedUser = likedUsers[likedUserId];

      const user = (await getBasicUserProfile(
        thisLikedUser._id
      )) as unknown as BasicUserProfile;

      const timestamp = likedUsers.find(
        (likedUser: TimestampId) => likedUser._id === thisLikedUser._id
      )?.timestamp;

      likedUserData.push({ ...user, timestamp: Number(timestamp) });
    }

    const sorted = likedUserData.sort(
      (timestamp1: Follower, timestamp2: Follower) =>
        timestamp2.timestamp - timestamp1.timestamp
    );

    return sorted;
  } catch {
    return null;
  }
};

export default getLikesForPost;
