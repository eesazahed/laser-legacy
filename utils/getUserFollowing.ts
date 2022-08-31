import type {
  BasicUserProfile,
  Follower,
  PublicUser,
  TimestampId,
} from "../types";
import getBasicUserProfile from "./getBasicUserProfile";
import getUserByUsername from "./getUserByUsername";

const getUserFollowing = async (username: string) => {
  try {
    const follow = (await getUserByUsername(username)) as unknown as PublicUser;
    const followings = follow.following;
    const followingData = [];

    for (const followingId in followings) {
      const thisFollowing = followings[followingId];

      const user = (await getBasicUserProfile(
        thisFollowing._id
      )) as unknown as BasicUserProfile;

      const timestamp = followings.find(
        (following: TimestampId) => following._id === thisFollowing._id
      )?.timestamp;

      followingData.push({ ...user, timestamp: Number(timestamp) });
    }

    const sorted = followingData.sort(
      (timestamp1: Follower, timestamp2: Follower) =>
        timestamp2.timestamp - timestamp1.timestamp
    );

    return sorted;
  } catch {
    return null;
  }
};

export default getUserFollowing;
