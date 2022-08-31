import type { NextPage } from "next";

interface Props {
  text: string;
}

const Success: NextPage<Props> = ({ text }) => {
  return <span style={{ color: "green" }}>{text}</span>;
};

export default Success;
