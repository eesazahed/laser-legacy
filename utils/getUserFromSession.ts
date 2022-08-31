import { getToken } from "next-auth/jwt";
import clientPromise from "../lib/mongodb";

const getUserFromSession = async (req: any) => {
  try {
    const token = await getToken({ req });
    let user = null;

    const db = (await clientPromise).db().collection("users");
    await db.findOne({ email: token?.email }).then((result) => {
      user = result;
    });

    return user;
  } catch {
    return null;
  }
};

export default getUserFromSession;
