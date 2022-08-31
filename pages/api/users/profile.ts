import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "../../../types";
import { getToken } from "next-auth/jwt";
import clientPromise from "../../../lib/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });

  if (!token) {
    return res.status(401).json({ message: "No auth provided." });
  }

  const db = (await clientPromise).db().collection("users");

  if (req.method === "GET") {
    await db
      .findOne({ email: token.email })
      .then((result) => {
        const user = result as User;
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
