import clientPromise from "../lib/mongodb";
import type {
  BasicUserProfile,
  Follower,
  PublicUser,
  TimestampId,
  User,
} from "../types";
import getBasicUserProfile from "./getBasicUserProfile";
import getUserByUsername from "./getUserByUsername";

const getSuggestedProfiles = async () => {
  try {
    const users = (await clientPromise).db().collection("users");
    const userArray = (await users.find({}).toArray()) as unknown as User[];
    const suggested = [];

    for (const userId in userArray) {
      const thisUser = userArray[userId];
      suggested.push({
        name: thisUser.public.name,
        username: thisUser.public.username,
        _id: thisUser.public._id,
      });
    }

    let shuffled = suggested.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 3);

    return selected;
  } catch {
    return null;
  }
};

export default getSuggestedProfiles;
