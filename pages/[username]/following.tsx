import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PageHead from "../../components/PageHead";
import Username from "../../components/Username";
import styles from "../../styles/Profile.module.css";
import type { Follower, PublicUser } from "../../types";
import getUserByUsername from "../../utils/getUserByUsername";
import getUserFollowing from "../../utils/getUserFollowing";

interface Props {
  profile: PublicUser;
  following: Follower[];
}

const Following: NextPage<Props> = ({ profile, following }) => {
  const { data: session, status } = useSession();

  return (
    <div className={styles.container}>
      <PageHead title="View Following" />

      {!profile && (
        <main className={styles.main}>
          <p className={styles.description}>This page could not be found.</p>
        </main>
      )}

      {profile && status === "loading" && (
        <main className={styles.main}>
          <p className={styles.description}>Loading...</p>
        </main>
      )}

      {profile && status !== "loading" && (
        <main className={styles.main}>
          <div className={styles.profile}>
            <h1 className={styles.profileTitle}>View Following</h1>
            <p className={styles.profileDescription}>
              <Link href={`/${profile.username}`}>
                <a>&larr; Back to profile</a>
              </Link>
            </p>
            {following.length === 0 && (
              <p>This user isn&apos;t following anyone.</p>
            )}
            <ul className={styles.following}>
              {following.map((following: Follower) => {
                return (
                  <li key={following._id}>
                    <p>
                      {following.name} (@
                      <Username username={following.username} />){" "}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </main>
      )}
    </div>
  );
};

export default Following;

export const getServerSideProps = async (context: any) => {
  const profile = (await getUserByUsername(context.params.username)) || null;
  const following = (await getUserFollowing(context.params.username)) || null;

  return {
    props: {
      profile: profile,
      following: following,
    },
  };
};
