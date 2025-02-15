import clientPromise from "../lib/mongodb";
import type { User, BasicUserProfile } from "../types";

import getUserFromSession from "./getUserFromSession";

const getSuggestedProfiles = async (req: any) => {
  try {
    const user = (await getUserFromSession(req)) as unknown as User;

    const users = (await clientPromise).db().collection("users");
    const userArray = (await users.find({}).toArray()) as unknown as User[];
    let suggested: BasicUserProfile[] = [];

    for (const userId in userArray) {
      const thisUser = userArray[userId];
      if (
        thisUser.public.name &&
        thisUser.public.username &&
        thisUser.public._id
      ) {
        if (
          !thisUser.public.followers.some(
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
    }

    suggested = suggested.filter(
      (suggestedUser) => suggestedUser._id !== user._id.toString()
    );

    let shuffled = suggested.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 3);

    if (
      user.public._id !== "63110a927a37f60a3572d1f5" &&
      !user.public.following.some(
        (following) => following._id === "63110a927a37f60a3572d1f5"
      ) &&
      !selected.some(
        (suggestUser) => suggestUser._id === "63110a927a37f60a3572d1f5"
      )
    ) {
      selected.unshift({
        name: "Eesa Zahed",
        username: "eesa",
        _id: "63110a927a37f60a3572d1f5",
      });
    }

    return selected;
  } catch {
    return null;
  }
};

export default getSuggestedProfiles;
