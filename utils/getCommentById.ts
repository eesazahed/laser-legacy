import { ObjectId } from "mongodb";
import clientPromise from "../lib/mongodb";

const getCommentById = async (_id: string) => {
  try {
    let comment = null;

    const db = (await clientPromise).db().collection("comments");
    await db.findOne({ _id: new ObjectId(_id) }).then((result) => {
      comment = result;
    });

    return comment;
  } catch {
    return null;
  }
};

export default getCommentById;
