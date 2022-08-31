import type {
  BasicUserProfile,
  Follower,
  PublicUser,
  TimestampId,
} from "../types";
import getBasicUserProfile from "./getBasicUserProfile";
import getUserByUsername from "./getUserByUsername";

const getUserFollowers = async (username: string) => {
  try {
    const follow = (await getUserByUsername(username)) as unknown as PublicUser;
    const followers = follow.followers;
    const followerData = [];

    for (const followerId in followers) {
      const thisFollower = followers[followerId];

      const user = (await getBasicUserProfile(
        thisFollower._id
      )) as unknown as BasicUserProfile;

      const timestamp = followers.find(
        (follower: TimestampId) => follower._id === thisFollower._id
      )?.timestamp;

      followerData.push({ ...user, timestamp: Number(timestamp) });
    }

    const sorted = followerData.sort(
      (timestamp1: Follower, timestamp2: Follower) =>
        timestamp2.timestamp - timestamp1.timestamp
    );

    return sorted;
  } catch {
    return null;
  }
};

export default getUserFollowers;
