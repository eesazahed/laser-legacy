import { ObjectId } from "mongodb";
import clientPromise from "../lib/mongodb";
import { BasicUserProfile, PostComment } from "../types";
import getBasicUserProfile from "./getBasicUserProfile";
import getPostComments from "./getPostComments";

const getPostById = async (_id: string) => {
  try {
    let post = null;

    const db = (await clientPromise).db().collection("posts");
    await db.findOne({ _id: new ObjectId(_id) }).then(async (result) => {
      if (result) {
        const sender = (await getBasicUserProfile(
          result?.senderId
        )) as unknown as BasicUserProfile;

        const comments = (await getPostComments(
          _id
        )) as unknown as PostComment[];

        post = { ...result, sender: sender, comments: comments };
      }
    });

    return post;
  } catch {
    return null;
  }
};

export default getPostById;
