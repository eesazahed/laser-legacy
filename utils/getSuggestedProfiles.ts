import clientPromise from "../lib/mongodb";
import type { User } from "../types";
import getUserFromSession from "./getUserFromSession";

const getSuggestedProfiles = async (req: any) => {
  try {
    const user = (await getUserFromSession(req)) as unknown as User;

    const users = (await clientPromise).db().collection("users");
    const userArray = (await users.find({}).toArray()) as unknown as User[];
    let suggested = [];

    for (const userId in userArray) {
      const thisUser = userArray[userId];

      if (
        thisUser.public.followers.some(
          (follower) => follower._id === user.public._id
        )
      ) {
        suggested.push({
          name: thisUser.public.name,
          username: thisUser.public.username,
          _id: thisUser.public._id,
        });
      }
    }

    suggested = suggested.filter(
      (suggestedUser) => suggestedUser._id !== user._id.toString()
    );

    let shuffled = suggested.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 3);

    return selected;
  } catch {
    return null;
  }
};

export default getSuggestedProfiles;
