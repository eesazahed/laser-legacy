import type { NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "../styles/Navbar.module.css";

interface Props {
  unread: any;
  mobile: boolean;
}

const Links: NextPage<Props> = ({ unread, mobile }) => {
  const { data: session, status } = useSession();

  return (
    <div
      className={`${styles.links} ${mobile ? styles.mobile : styles.desktop}`}
    >
      {status === "authenticated" && (
        <>
          <Link href="/new">
            <a className={styles.link}>
              <i className="bi bi-pencil-square"></i>
              <span className={styles.text}>New</span>
            </a>
          </Link>

          <Link href="/settings">
            <a className={styles.link}>
              <i className="bi bi-gear"></i>
              <span className={styles.text}>Settings</span>
            </a>
          </Link>

          <Link href="/profile">
            <a className={styles.link}>
              <i className="bi bi-person-circle"></i>
              <span className={styles.text}>Profile</span>
            </a>
          </Link>
          <Link href="/notifications">
            <a className={styles.link}>
              <div className={styles.count}>
                <i className="bi bi-bell"></i>
                {typeof unread === "number" && unread > 0 && (
                  <span className={styles.indicator}>{unread}</span>
                )}
              </div>
              {mobile && <span className={styles.text}>Notifications</span>}
            </a>
          </Link>
        </>
      )}

      {status === "unauthenticated" && (
        <button className={styles.btn} onClick={() => signIn()}>
          Sign In
        </button>
      )}

      {status === "authenticated" && (
        <button className={styles.btn} onClick={() => signOut()}>
          Sign Out
        </button>
      )}
    </div>
  );
};

export default Links;
