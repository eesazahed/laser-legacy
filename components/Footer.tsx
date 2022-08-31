import type { NextPage } from "next";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "../styles/Footer.module.css";
import Link from "next/link";

const Footer: NextPage = () => {
  return (
    <footer className={styles.footer}>
      <p>
        <Link href="/about">
          <a>
            <u>About this site</u>
          </a>
        </Link>{" "}
        &bull;{" "}
        <a target="_blank" rel="noreferrer" href="mailto:eszhd1@gmail.com">
          <u>Contact the developer</u>
        </a>
      </p>
      <p>
        Developed by{" "}
        <a
          style={{ color: "#0070f3" }}
          target="_blank"
          rel="noreferrer"
          href="https://eesa.zahed.ca"
        >
          <u>Eesa Zahed</u>
        </a>
      </p>
    </footer>
  );
};

export default Footer;
