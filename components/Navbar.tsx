import type { NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "../styles/Navbar.module.css";
import { useState } from "react";
import Links from "./Links";
import Image from "next/image";

const Navbar: NextPage = () => {
  const { data: session, status } = useSession();

  const [showNav, setShowNav] = useState<boolean>(false);

  if (status === "loading") {
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
        <Links mobile={false} />

        <div
          className={styles.menu}
          onClick={() => (showNav ? setShowNav(false) : setShowNav(true))}
        >
          {showNav ? (
            <i className="bi bi-x-lg"></i>
          ) : (
            <i className="bi bi-list"></i>
          )}
        </div>
      </nav>

      {showNav && (
        <div className={styles.dropdown}>
          <Links mobile={true} />
        </div>
      )}
    </header>
  );
};

export default Navbar;
