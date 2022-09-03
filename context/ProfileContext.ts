import React from "react";
import { Post, PublicUser } from "../types";

interface Props {
  user: PublicUser | undefined;
}

const ProfileContext = React.createContext<Props>({
  user: undefined,
});

export default ProfileContext;
