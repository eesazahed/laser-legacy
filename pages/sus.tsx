import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Sus: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  });

  return <></>;
};

export default Sus;
