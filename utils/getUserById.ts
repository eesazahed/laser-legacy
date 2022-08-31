import { ObjectId } from "mongodb";
import clientPromise from "../lib/mongodb";

const getUserById = async (_id: string) => {
  try {
    let user = null;

    const db = (await clientPromise).db().collection("users");
    await db.findOne({ _id: new ObjectId(_id) }).then((result) => {
      user = result?.public;
    });

    return user;
  } catch {
    return null;
  }
};

export default getUserById;
