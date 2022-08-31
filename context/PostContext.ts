import React from "react";
import { Post, PublicUser } from "../types";

interface Props {
  user: PublicUser | undefined;
  post: Post | undefined;
}

const PostContext = React.createContext<Props>({
  user: undefined,
  post: undefined,
});

export default PostContext;
