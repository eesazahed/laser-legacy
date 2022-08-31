import { ObjectId } from "mongodb";
import clientPromise from "../lib/mongodb";

const getBasicUserProfile = async (_id: string) => {
  try {
    let user = null;

    const db = (await clientPromise).db().collection("users");
    await db.findOne({ _id: new ObjectId(_id) }).then((result) => {
      user = {
        _id: result?.public._id,
        name: result?.public.name,
        username: result?.public.username,
      };
    });

    return user;
  } catch {
    return null;
  }
};

export default getBasicUserProfile;
