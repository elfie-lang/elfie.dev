import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./card.module.css";

// @lfy def/components/card.lfy:BookIcon
export const BookIcon: string = "/elfie/card-book.svg";

// @lfy def/components/card.lfy:CodeIcon
export const CodeIcon: string = "/elfie/card-code.svg";

// @lfy def/components/card.lfy:TerminalIcon
export const TerminalIcon: string = "/elfie/card-terminal.svg";

// @lfy def/components/card.lfy:NotebookIcon
export const NotebookIcon: string = "/elfie/card-notebook.svg";

// @lfy def/components/card.lfy:CardIcon
export const CardIcon = {
  book: "book",
  code: "code",
  notebook: "notebook",
  terminal: "terminal",
} as const;

// @lfy def/components/card.lfy:CardIcon
export type CardIcon = (typeof CardIcon)[keyof typeof CardIcon];

// @lfy def/components/card.lfy:ResourceCard#ResourceCard:ResourceCard:d1b964502b54b676ee04d751d4351ee08cc47cb3970cc765b77b4ac38e4988a3
const iconImage: Record<CardIcon, { readonly src: string; readonly alt: string }> = {
  book: { src: BookIcon, alt: "Book" },
  code: { src: CodeIcon, alt: "Code" },
  notebook: { src: NotebookIcon, alt: "Notebook and pen" },
  terminal: { src: TerminalIcon, alt: "Terminal" },
};

// @lfy def/components/card.lfy:ResourceCard#ResourceCard:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/components/card.lfy:ResourceCard#ResourceCard:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type ResourceCardProps = {
  readonly icon: CardIcon;
  readonly label: string;
  readonly title: string;
  readonly content: ReactNode;
  readonly href: string;
  readonly action: string;
};

// @lfy def/components/card.lfy:ResourceCard#ResourceCard:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
// @lfy def/components/card.lfy:ResourceCard#ResourceCard:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
export function ResourceCard({
  icon,
  label,
  title,
  content,
  href,
  action,
}: ResourceCardProps) {
  const image = iconImage[icon];
  // @lfy def/components/card.lfy:ResourceCard#ResourceCard:ResourceCard:1ad29294d72b8ed87aefdded18324673e1bdf76c8a7f33c7b5f86fafdce2f3df
  const linkText = (
    <>
      {action} <span aria-hidden="true">→</span>
    </>
  );
  // @lfy def/components/card.lfy:ResourceCard#ResourceCard:ResourceCard:e213f3ce70b625b3e98135acbe921982081956e62c3e634f0ddb05d00e679c4c
  const link = href.startsWith("/") ? (
    <Link className={styles.action} href={href}>
      {linkText}
    </Link>
  ) : (
    <a className={styles.action} href={href}>
      {linkText}
    </a>
  );
  // @lfy def/components/card.lfy:ResourceCard#ResourceCard:fromFigma:4fa9f0e39531f869165fcd4266f0b3f0c27d9241fc7a1438d556ebada9241513
  // @lfy def/components/card.lfy:ResourceCard#ResourceCard:ResourceCard:d1b964502b54b676ee04d751d4351ee08cc47cb3970cc765b77b4ac38e4988a3
  // @lfy def/components/card.lfy:ResourceCard#ResourceCard:ResourceCard:787d7eeb2d2904b3a185464f3aa69569a0d97a7459cc7766d1c16a82a01b8aeb
  // @lfy def/components/card.lfy:ResourceCard#ResourceCard:ResourceCard:f57e97364b9d6a94d9dcfaecc1eb0dc2444ea9fac3b3ec1a6b0de1ed03f8dbab
  return (
    <article className={styles.card}>
      <div className={styles.metadata}>
        <img
          className={styles.icon}
          src={image.src}
          alt={image.alt}
          width={23}
          height={23}
          decoding="async"
        />
        <p className={styles.label}>{label}</p>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.content}>{content}</div>
      {link}
    </article>
  );
}

// @lfy def/components/card.lfy:CardGrid#CardGrid:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/components/card.lfy:CardGrid#CardGrid:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type CardGridProps = {
  readonly content: ReactNode;
};

// @lfy def/components/card.lfy:CardGrid#CardGrid:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
// @lfy def/components/card.lfy:CardGrid#CardGrid:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
export function CardGrid({ content }: CardGridProps) {
  // @lfy def/components/card.lfy:CardGrid#CardGrid:CardGrid:26710262abee46e978c9cf314d5653f928f5620219731d6e88b8f14664d3c286
  // @lfy def/components/card.lfy:CardGrid#CardGrid:CardGrid:67a136ed7aeeda480aa4cbf3d37d77164d8e93b3c2ed006f75f51b04db81871f
  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid}>{content}</div>
    </div>
  );
}
