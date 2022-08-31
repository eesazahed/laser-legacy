import type { NextPage } from "next";

interface Props {
  text: string;
}

const Error: NextPage<Props> = ({ text }) => {
  return <span style={{ color: "red" }}>{text}</span>;
};

export default Error;
