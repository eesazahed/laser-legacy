import type { NextPage } from "next";
import Head from "next/head";

interface Props {
  title: string;
}

const PageHead: NextPage<Props> = ({ title }) => {
  let pageTitle = `LaserSocial - ${title}`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content="LaserSocial" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default PageHead;
