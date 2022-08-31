import { ObjectId } from "mongodb";
import clientPromise from "../lib/mongodb";

const getReplyById = async (_id: string) => {
  try {
    let reply = null;

    const db = (await clientPromise).db().collection("replies");
    await db.findOne({ _id: new ObjectId(_id) }).then((result) => {
      reply = result;
    });

    return reply;
  } catch {
    return null;
  }
};

export default getReplyById;
