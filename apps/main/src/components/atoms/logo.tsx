import NextLink from "next/link";

import { LogoImage } from "./images";
import styles from "./logo.module.css";

// @lfy def/atoms.lfy:Logo#Logo:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
// @lfy def/atoms.lfy:Logo#Logo:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
export function Logo() {
  // @lfy def/atoms.lfy:Logo#Logo:Logo:6a2a5cdaceb28e43cb60c3a8d4b26f61d92622e8ef8de34a4d3a68b7076eb3d5
  // @lfy def/atoms.lfy:Logo#Logo:fromFigma:709bbbd082f509bd23dc6341cb1393cd5d8dabaf6340e38cfd43ede1a908e18d
  return (
    <NextLink href="/" aria-label="Elfie home" className={styles.logo}>
      <img
        className={styles.logoImage}
        src={LogoImage}
        alt="Elfie"
        width={1254}
        height={1254}
        decoding="async"
      />
    </NextLink>
  );
}
