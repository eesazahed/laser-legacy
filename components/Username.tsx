import type { NextPage } from "next";
import Link from "next/link";

interface Props {
  username: string;
}

const Username: NextPage<Props> = ({ username }) => {
  return (
    <Link href={`/${username}`}>
      <a className="username">{username}</a>
    </Link>
  );
};

export default Username;
