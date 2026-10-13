"use client";

import { useId, useReducer, type ReactNode } from "react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Navigation } from "@/components/documentation/navigation";
import { DocumentationSearch } from "@/components/documentation/search";

import styles from "./layout.module.css";

// @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type DocumentationLayoutProps = {
  readonly currentSlug: string;
  readonly content: ReactNode;
};

// @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
// @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
export function DocumentationLayout({
  currentSlug,
  content,
}: DocumentationLayoutProps) {
  const navigationId = useId();
  const [menuExpanded, toggleMenu] = useReducer(
    (expanded: boolean) => !expanded,
    false,
  );
  // @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:DocumentationLayout:aef290b1060d216c63abcdd0fc633a392446329ec87bf860a3b6121fa4d298c1
  // @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:DocumentationLayout:04239c7563e8e8d6ddf789ccd269408c49bf1b8dc7564a62a9e352e86d25a6fc
  // @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:DocumentationLayout:8c144fed1cc44cbc0cc277e9ef7fb313b33f1d43d45f13c7fe847fe01977c0c2
  // @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:component:672ccb51917bf1bc38897f2711c908712450d00a7969a6824a12f46624f34433
  // @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:DocumentationLayout:49210b7e86b5f920e49add12b728751fe567a322df1f15a15a0024e6901ba7af
  // @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:DocumentationLayout:013e30f691acf9e48115074f565669e6dd49e3cc217a9bf4729a77ce211aa82b
  // @lfy def/documentation/layout.lfy:DocumentationLayout#DocumentationLayout:DocumentationLayout:b5b58d2fcf98689cebe755cd8c1c4b35e24612bbded7d3f4a6d3dd2ad296d643
  return (
    <div className={styles.layout}>
      <Header content={<DocumentationSearch />} />
      <div className={styles.workspace}>
        <button
          type="button"
          className={styles.menuButton}
          aria-controls={navigationId}
          aria-expanded={menuExpanded}
          onClick={toggleMenu}
        >
          Documentation menu
        </button>
        <aside
          id={navigationId}
          className={styles.navigation}
          data-expanded={menuExpanded}
        >
          <Navigation currentSlug={currentSlug} />
        </aside>
        <main className={styles.content}>{content}</main>
      </div>
      <Footer
        content={
          <p>
            An early language, a little magic. Site content is a conceptual
            draft.
          </p>
        }
      />
    </div>
  );
}
