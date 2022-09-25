import type { NextPage } from "next";
import Link from "next/link";
import { useSession } from "next-auth/react";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "../styles/Navbar.module.css";
import { useState } from "react";
import Links from "./Links";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";

const Navbar: NextPage = () => {
  const { data: session, status } = useSession();

  const [showNav, setShowNav] = useState<boolean>(false);

  const router = useRouter();

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR("/api/notifications", fetcher);
  const unread = data;

  if (status === "loading" && router.asPath !== "/banned") {
    return (
      <header className={styles.container}>
        <nav className={styles.navbar}>
          <a className={styles.link}>Loading...</a>
        </nav>
      </header>
    );
  }

  return (
    <header className={styles.container}>
      <nav className={styles.navbar}>
        <Link href="/">
          <a className={styles.link}>
            <div className={styles.logo}>
              <Image
                alt="LaserSocial Logo"
                width={30}
                height={30}
                src="/logo.png"
              />
            </div>
            LaserSocial
          </a>
        </Link>
        <Links unread={unread} mobile={false} />

        <div
          className={styles.menu}
          onClick={() => (showNav ? setShowNav(false) : setShowNav(true))}
        >
          {showNav ? (
            <i className="bi bi-x-lg"></i>
          ) : (
            <div className={styles.count}>
              <i className="bi bi-list">
                {typeof unread === "number" && unread > 0 && (
                  <span className={styles.indicator}>{unread}</span>
                )}
              </i>
            </div>
          )}
        </div>
      </nav>

      {showNav && (
        <div className={styles.dropdown}>
          <Links unread={unread} mobile={true} />
        </div>
      )}
    </header>
  );
};

export default Navbar;
