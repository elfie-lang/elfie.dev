import type { ReactNode } from "react";

import { Link, Logo } from "@/components/atoms";

import styles from "./footer.module.css";

// @lfy def/components/footer.lfy:Footer#Footer:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/components/footer.lfy:Footer#Footer:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type FooterProps = {
  readonly content: ReactNode;
};

// @lfy def/components/footer.lfy:Footer#Footer:Footer:f51fb74eec047d1f9f432cbc0bd2c04e138bde4a8ae90e3cc267f2766cdfd067
const resourceLinks = [
  { href: "/", label: "The Elfie language" },
  { href: "/docs", label: "Documentation" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "https://github.com/elfie-lang/elfie", label: "GitHub" },
  { href: "https://github.com/elfie-lang/elfie", label: "Community" },
  { href: "https://github.com/elfie-lang/elfie/releases", label: "Download" },
] as const;

// @lfy def/components/footer.lfy:Footer#Footer:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
// @lfy def/components/footer.lfy:Footer#Footer:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
export function Footer({ content }: FooterProps) {
  // @lfy def/components/footer.lfy:Footer#Footer:fromFigma:ed60bab803da688912cb7e37bce90e18830b00c7154b0e23b1ddff8315f19239
  // @lfy def/components/footer.lfy:Footer#Footer:Footer:e914d50b37e6d75226fe156880116e527e9cd280d68106b639f6cd83cc9dd7f6
  // @lfy def/components/footer.lfy:Footer#Footer:Footer:661a5b3d6c48efed7635c264e756a0991b9df5a29386ba24da69002906cfdef0
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <div className={styles.brand}>
          <span className={styles.logoSlot}>
            <span className={styles.logoScale}>
              <Logo />
            </span>
          </span>
          <span className={styles.wordmark}>Elfie</span>
        </div>
        <nav aria-label="Resources">
          <ul className={styles.resources}>
            {resourceLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} content={link.label} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={styles.footerNotes}>
        <p>© Elfie</p>
        {content}
      </div>
    </footer>
  );
}
