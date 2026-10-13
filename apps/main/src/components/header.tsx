import NextLink from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/atoms";

import styles from "./header.module.css";

// @lfy def/components/header.lfy:HeaderItem#HeaderItem:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/components/header.lfy:HeaderItem#HeaderItem:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type HeaderItemProps = {
  readonly content: ReactNode;
  readonly href: string;
  readonly current?: boolean;
};

// @lfy def/components/header.lfy:HeaderItem#HeaderItem:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
// @lfy def/components/header.lfy:HeaderItem#HeaderItem:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
export function HeaderItem({ content, href, current = false }: HeaderItemProps) {
  // @lfy def/components/header.lfy:HeaderItem#HeaderItem:fromFigma:baea81fc0f8dc85885f125376a14cfba480cf69baa64d0ef1336a5c1805b90df
  // @lfy def/components/header.lfy:HeaderItem#HeaderItem:HeaderItem:661a5b3d6c48efed7635c264e756a0991b9df5a29386ba24da69002906cfdef0
  return (
    <NextLink
      href={href}
      className={styles.item}
      aria-current={current ? "page" : undefined}
    >
      {content}
    </NextLink>
  );
}

// @lfy def/components/header.lfy:Header#Header:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/components/header.lfy:Header#Header:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type HeaderProps = {
  readonly content: ReactNode;
};

// @lfy def/components/header.lfy:Header#Header:Header:83dd1370092bfccd1d779662da542898bdd318c0091dd4ab2a542fb28b3e0748
const navigationLinks = [
  { href: "/docs", label: "Documentation" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "https://github.com/elfie-lang/elfie", label: "Community" },
  { href: "https://github.com/elfie-lang/elfie/releases", label: "Download" },
] as const;

// @lfy def/components/header.lfy:Header#Header:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
// @lfy def/components/header.lfy:Header#Header:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
export function Header({ content }: HeaderProps) {
  // @lfy def/components/header.lfy:Header#Header:fromFigma:75716b6da2896b2de2b0bd9b7a073795232d7be3649e1cbbd2d9c28daff115d1
  // @lfy def/components/header.lfy:Header#Header:Header:db64c671bfb6b8e5802e8b49a16498172412fb3b09dca7889dfdb166495755d7
  // @lfy def/components/header.lfy:Header#Header:Header:e914d50b37e6d75226fe156880116e527e9cd280d68106b639f6cd83cc9dd7f6
  // @lfy def/components/header.lfy:Header#Header:Header:661a5b3d6c48efed7635c264e756a0991b9df5a29386ba24da69002906cfdef0
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logoSlot}>
          <span className={styles.logoScale}>
            <Logo />
          </span>
        </span>
        <span className={styles.wordmark}>Elfie</span>
      </div>
      <div className={styles.rightNav}>
        {content}
        <nav aria-label="Primary">
          <ul className={styles.siteLinks}>
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <HeaderItem href={link.href} content={link.label} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
