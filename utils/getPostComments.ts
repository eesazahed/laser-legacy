import { ObjectId } from "mongodb";
import clientPromise from "../lib/mongodb";
import { BasicUserProfile, PostComment, Reply } from "../types";
import getBasicUserProfile from "./getBasicUserProfile";
import getCommentById from "./getCommentById";
import getCommentReplies from "./getCommentReplies";

const getPostComments = async (_id: string) => {
  try {
    let postComments: PostComment[] = [];

    const db = (await clientPromise).db().collection("comments");

    const comments = await db.find({ postId: _id }).toArray();

    for (const comment in comments) {
      const thisComment = comments[comment];
      const commentData = (await getCommentById(
        thisComment._id.toString()
      )) as unknown as PostComment;

      const sender = (await getBasicUserProfile(
        commentData.senderId
      )) as unknown as BasicUserProfile;

      const replies = (await getCommentReplies(
        commentData._id.toString()
      )) as unknown as Reply[];

      postComments.push({
        ...commentData,
        sender: sender,
        commentReplies: replies,
      });
    }

    const sorted = postComments.sort(
      (timestamp1: PostComment, timestamp2: PostComment) =>
        timestamp2.timestamp - timestamp1.timestamp
    );

    return sorted;
  } catch {
    return null;
  }
};

export default getPostComments;
