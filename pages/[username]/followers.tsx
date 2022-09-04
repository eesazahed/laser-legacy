import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PageHead from "../../components/PageHead";
import Username from "../../components/Username";
import styles from "../../styles/Profile.module.css";
import type { Follower, PublicUser } from "../../types";
import getUserByUsername from "../../utils/getUserByUsername";
import getUserFollowers from "../../utils/getUserFollowers";

interface Props {
  profile: PublicUser;
  followers: Follower[];
}

const Followers: NextPage<Props> = ({ profile, followers }) => {
  const { data: session, status } = useSession();

  return (
    <div className={styles.container}>
      <PageHead title="View Followers" />

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
            <h1 className={styles.profileTitle}>View Followers</h1>
            <p className={styles.profileDescription}>
              <Link href={`/${profile.username}`}>
                <a>&larr; Back to profile</a>
              </Link>
            </p>
            {followers.length === 0 && <p>This user has no followers.</p>}
            <ul>
              {followers.map((follower: Follower) => {
                return (
                  <li key={follower._id}>
                    <p>
                      {follower.name} (@
                      <Username username={follower.username} />)
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

export default Followers;

export const getServerSideProps = async (context: any) => {
  const profile = (await getUserByUsername(context.params.username)) || null;
  const followers = (await getUserFollowers(context.params.username)) || null;

  return {
    props: {
      profile: profile,
      followers: followers,
    },
  };
};
