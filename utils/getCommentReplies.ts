import clientPromise from "../lib/mongodb";
import { BasicUserProfile, Reply } from "../types";
import getBasicUserProfile from "./getBasicUserProfile";
import getReplyById from "./getReplyById";

const getCommentReplies = async (_id: string) => {
  try {
    const replies = (await clientPromise).db().collection("replies");

    const allReplies = (await replies
      .find({ parentId: _id })
      .toArray()) as unknown as Reply[];

    const replyData: Reply[] = [];

    const getNestedReplies = async (initialReply: Reply) => {
      const sender = (await getBasicUserProfile(
        initialReply.senderId
      )) as unknown as BasicUserProfile;

      for (const threadedReply in initialReply.replyReplies) {
        const thisThreadedReply = (await getReplyById(
          initialReply.replyReplies[threadedReply]._id.toString()
        )) as unknown as Reply;

        let index = initialReply.replyReplies.findIndex(
          (reply) => reply._id.toString() === thisThreadedReply._id.toString()
        );

        initialReply.replyReplies[index] = await getNestedReplies(
          thisThreadedReply
        );
      }

      return { ...initialReply, sender: sender };
    };

    for (const reply in allReplies) {
      replyData.push(await getNestedReplies(allReplies[reply]));
    }

    return replyData;
  } catch {
    return null;
  }
};

export default getCommentReplies;
