import React from "react";
import Image from "next/image";
import styles from "../../styles/Footer.module.scss";

function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        href="https://traverston.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="me-2">Powered by</span>
        <span className={styles.logo}>
          <Image
            src="/images/poweredByLogoSmall.png"
            alt="Traverston Logo"
            width={160}
            height={20}
          />
        </span>
      </a>
    </footer>
  );
}

export default Footer;
