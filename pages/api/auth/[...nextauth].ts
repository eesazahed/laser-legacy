import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { Profile } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import GoogleProvider from "next-auth/providers/google";
import { OAuthConfig } from "next-auth/providers";
import type { User } from "../../../types";

const GOOGLE_AUTHORIZATION_URL =
  "https://accounts.google.com/o/oauth2/v2/auth" +
  new URLSearchParams({
    prompt: "consent",
    access_type: "offline",
    response_type: "code",
  });

const auth = async (req: NextApiRequest, res: NextApiResponse) => {
  return await NextAuth(req, res, {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID as string,
        clientSecret: process.env.GOOGLE_SECRET as string,
        authorization: GOOGLE_AUTHORIZATION_URL,
      }) as OAuthConfig<Profile>,
    ],
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
      signIn: async ({ user, account, profile }) => {
        return true;
      },
      redirect: async ({ url, baseUrl }) => {
        return baseUrl;
      },
      jwt: async ({ token, user, account }) => {
        return token;
      },
      session: async ({ session, token }) => {
        if (session) {
          const db = (await clientPromise).db().collection("users");
          let email = session.user?.email;

          const user = (await db.findOne({ email: email })) as unknown as User;

          await db
            .updateOne(
              { email: email },
              {
                $set: {
                  ip: req.headers["x-forwarded-for"],
                  "public.lastOnline": Date.now(),
                },
              }
            )
            .catch((error) => error);

          if (!user.public.joined) {
            await db
              .updateOne(
                { email: email },
                {
                  $set: {
                    public: {
                      _id: user._id.toString(),
                      name: `User ${user._id.toString().substring(14)}`,
                      username: `user_${user._id.toString().substring(14)}`,
                      bio: "",
                      followers: [],
                      followerCount: 0,
                      following: [],
                      followingCount: 0,
                      likedPosts: [],
                      lastOnline: Date.now(),
                      joined: Date.now(),
                      admin: false,
                    },
                  },
                }
              )
              .catch((error) => error);
          }
        }

        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/auth/signin",
      newUser: "/auth/welcome",
    },
  });
};

export default auth;
