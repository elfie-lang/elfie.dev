import NextLink from "next/link";
import type { ReactNode } from "react";

import { Link } from "@/components/atoms";
import {
  DocumentationSection,
  documentationPages,
  documentationPath,
} from "@/lib/documentation/pages";

import styles from "./navigation.module.css";

// @lfy def/documentation/navigation.lfy:NavigationItem#NavigationItem:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/documentation/navigation.lfy:NavigationItem#NavigationItem:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type NavigationItemProps = {
  readonly content: ReactNode;
  readonly href: string;
  readonly current?: boolean;
};

// @lfy def/documentation/navigation.lfy:NavigationItem#NavigationItem:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
// @lfy def/documentation/navigation.lfy:NavigationItem#NavigationItem:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
export function NavigationItem({
  content,
  href,
  current = false,
}: NavigationItemProps) {
  // @lfy def/documentation/navigation.lfy:NavigationItem#NavigationItem:fromFigma:a7e728db97d634f51f3db7ec3d808cba45748e1b5263a2ea0a10c6798e89e31e
  // @lfy def/documentation/navigation.lfy:NavigationItem#NavigationItem:NavigationItem:661a5b3d6c48efed7635c264e756a0991b9df5a29386ba24da69002906cfdef0
  // @lfy def/documentation/navigation.lfy:NavigationItem#NavigationItem:NavigationItem:acab698193bc938b4205965663bd1e3bc180b42efc0b1ba68fda777058a9a042
  // @lfy def/documentation/navigation.lfy:NavigationItem#NavigationItem:NavigationItem:09f31522f5a3d6139a52a4b68543a6e72428d3f6f9f7e00b1fc7fb3df3b2bfee
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

// @lfy def/documentation/navigation.lfy:NavigationSection
export type NavigationLink = {
  readonly label: string;
  readonly slug: string;
};

// @lfy def/documentation/navigation.lfy:NavigationSection#NavigationSection:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/documentation/navigation.lfy:NavigationSection#NavigationSection:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type NavigationSectionProps = {
  readonly title: string;
  readonly links: readonly NavigationLink[];
  readonly currentSlug?: string;
};

// @lfy def/documentation/navigation.lfy:NavigationSection#NavigationSection:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
// @lfy def/documentation/navigation.lfy:NavigationSection#NavigationSection:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
export function NavigationSection({
  title,
  links,
  currentSlug,
}: NavigationSectionProps) {
  const titleId = `docs-navigation-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  // @lfy def/documentation/navigation.lfy:NavigationSection#NavigationSection:fromFigma:e75a7a2011c155b966f053b4f62f207f303ba5c635e9810917d7f44b91160236
  // @lfy def/documentation/navigation.lfy:NavigationSection#NavigationSection:NavigationSection:4d7129945614dabe97bb210e8d8cebca1e43fb4caaca7d6df57a3ed611db2024
  // @lfy def/documentation/navigation.lfy:NavigationSection#NavigationSection:NavigationSection:f6d2b795a111796650fcaad9423765c3db7f8fdefc98798d59c242f9551daa3c
  // @lfy def/documentation/navigation.lfy:NavigationItem#NavigationItem:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  return (
    <div className={styles.section}>
      <p id={titleId} className={styles.sectionTitle}>
        {title}
      </p>
      <ul className={styles.items} aria-labelledby={titleId}>
        {links.map((link) => (
          <li key={link.slug}>
            <NavigationItem
              href={documentationPath(link.slug)}
              content={link.label}
              current={link.slug === currentSlug}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

// @lfy def/documentation/navigation.lfy:Navigation#Navigation:Navigation:2e82a78b739c380f4ff08163bb088983f9b88f04014fc1aae7bb1ab724d36307
export const navigationSections: readonly {
  readonly title: string;
  readonly links: readonly NavigationLink[];
}[] = Object.values(DocumentationSection).map((section) => ({
  title: section,
  links: documentationPages
    .filter((page) => page.section === section)
    .map((page) => ({ label: page.title, slug: page.slug })),
}));

// @lfy def/documentation/navigation.lfy:Navigation
export type NavigationProps = {
  readonly currentSlug?: string;
};

// @lfy def/documentation/navigation.lfy:Navigation#Navigation:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
// @lfy def/documentation/navigation.lfy:Navigation#Navigation:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
export function Navigation({ currentSlug }: NavigationProps = {}) {
  // @lfy def/documentation/navigation.lfy:NavigationSection#NavigationSection:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  // @lfy def/documentation/navigation.lfy:Navigation#Navigation:fromFigma:476cbf0124c29cd2b0897f054fa8b0b13cc438d8d0c233f114f25e22d3df15e5
  // @lfy def/documentation/navigation.lfy:Navigation#Navigation:Navigation:870a1c679c8387d06b8fb8da36e3e6b4f604f5aa1081b923e1b0e25026013e07
  // @lfy def/documentation/navigation.lfy:Navigation#Navigation:Navigation:2e82a78b739c380f4ff08163bb088983f9b88f04014fc1aae7bb1ab724d36307
  // @lfy def/documentation/navigation.lfy:Navigation#Navigation:Navigation:5c97f6d0677584bf187bcea8bbff344474963e9bfc592f3be2ddf0ac93344882
  // @lfy def/documentation/navigation.lfy:Navigation#Navigation:Navigation:4440dadf60cd77ddd5d72e9561f726c9302b121629cc162f8d0b6a73ae359fa9
  return (
    <div className={styles.navigation}>
      <nav className={styles.sections} aria-label="Documentation">
        {navigationSections.map((section) => (
          <NavigationSection
            key={section.title}
            title={section.title}
            links={section.links}
            currentSlug={currentSlug}
          />
        ))}
      </nav>
      <hr className={styles.divider} />
      <Link href="/" content="← Back to Elfie" showIndicator={false} />
      <p className={styles.version}>v0.1-experimental draft</p>
    </div>
  );
}
