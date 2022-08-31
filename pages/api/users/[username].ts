import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import type { User } from "../../../types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const username = String(req.query.username);
  const db = (await clientPromise).db().collection("users");

  if (req.method === "GET") {
    await db
      .find({})
      .toArray()
      .then((result) => {
        let user = result.find(
          (user) =>
            user.public.username.toLowerCase() === username.toLowerCase()
        ) as User;

        return res.status(200).json(user.public);
      })
      .catch(() => res.status(400).json({ message: "User doesn't exist." }));
  } else {
    return res
      .status(405)
      .json({ message: "Sorry, that method isn't allowed." });
  }
};

export default handler;
