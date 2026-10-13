import NextLink from "next/link";
import type { ReactNode } from "react";

import { ExternalLinkImage } from "./images";
import styles from "./link.module.css";

// @lfy def/atoms.lfy:Link
function classNames(
  ...names: ReadonlyArray<string | false | undefined>
): string {
  return names.filter(Boolean).join(" ");
}

// @lfy def/atoms.lfy:Link#Link:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
// @lfy def/atoms.lfy:Link#Link:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
export type LinkProps = {
  readonly content: ReactNode | string;
  readonly href: string;
  readonly showIndicator?: boolean;
  readonly className?: string;
};

// @lfy def/atoms.lfy:Link#Link:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
// @lfy def/atoms.lfy:Link#Link:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
export function Link({
  content,
  href,
  showIndicator = true,
  className,
}: LinkProps) {
  // @lfy def/atoms.lfy:Link#Link:Link:661a5b3d6c48efed7635c264e756a0991b9df5a29386ba24da69002906cfdef0
  // @lfy def/atoms.lfy:Link#Link:fromFigma:9e599869bc747ee4f66485d52f89253f058f174d7e59cc3d72bd77e79a84b090
  return (
    <NextLink href={href} className={classNames(styles.link, className)}>
      <span>{content}</span>
      {showIndicator && (
        <span className={styles.indicator} aria-hidden="true">
          <img
            className={styles.indicatorImage}
            src={ExternalLinkImage}
            alt=""
            width={17.5}
            height={17.5}
            decoding="async"
          />
        </span>
      )}
    </NextLink>
  );
}
