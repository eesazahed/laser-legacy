import clientPromise from "../lib/mongodb";
import type { User } from "../types";

const getUserByUsername = async (username: string) => {
  try {
    let user = null;

    const db = (await clientPromise).db().collection("users");

    await db
      .find({})
      .toArray()
      .then((result) => {
        const findUser = result.find(
          (user) =>
            user.public.username.toLowerCase() === username.toLowerCase()
        ) as User;
        if (findUser) {
          user = findUser.public;
        }
      });

    return user;
  } catch {
    return null;
  }
};

export default getUserByUsername;
