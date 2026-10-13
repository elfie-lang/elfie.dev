import { useId, type ReactNode } from "react";

import styles from "./callout.module.css";

// @lfy def/components/callout.lfy:InfoImage
export const InfoImage: string = "/elfie/info.svg";

// @lfy def/components/callout.lfy:CalloutKind
export const CalloutKind = {
  danger: "danger",
  info: "info",
  warning: "warning",
} as const;

// @lfy def/components/callout.lfy:CalloutKind
export type CalloutKind = (typeof CalloutKind)[keyof typeof CalloutKind];

// @lfy def/components/callout.lfy:Callout#Callout:Callout:542ebb55e82cdc4d6ed671dcab621a050671f910978c6ed41793756aa64b6915
const kindClass: Record<CalloutKind, string | undefined> = {
  danger: styles.danger,
  info: styles.info,
  warning: styles.warning,
};

// @lfy def/components/callout.lfy:Callout#Callout:Callout:927104a6212cb123555706f56e71ea66ea3e5d4a7d30c24c3990b29d43d797b3
const iconAlt: Record<CalloutKind, string> = {
  danger: "Danger",
  info: "Info",
  warning: "Warning",
};

// @lfy def/components/callout.lfy:Callout#Callout:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/components/callout.lfy:Callout#Callout:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type CalloutProps = {
  readonly header: ReactNode;
  readonly content: ReactNode;
  readonly kind?: CalloutKind;
};

// @lfy def/components/callout.lfy:Callout#Callout:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
// @lfy def/components/callout.lfy:Callout#Callout:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
export function Callout({
  header,
  content,
  kind = CalloutKind.info,
}: CalloutProps) {
  const headerId = useId();
  const className = [styles.callout, kindClass[kind]].filter(Boolean).join(" ");
  // @lfy def/components/callout.lfy:Callout#Callout:fromFigma:88438a62ef4eea7de6e16950e177340c3162121896e774412754869cc958075d
  // @lfy def/components/callout.lfy:Callout#Callout:Callout:927104a6212cb123555706f56e71ea66ea3e5d4a7d30c24c3990b29d43d797b3
  // @lfy def/components/callout.lfy:Callout#Callout:Callout:8f62ee75c8b6930689caad67fd0cfdddb2713fb9b7674ce711d4b7551386fca2
  // @lfy def/components/callout.lfy:Callout#Callout:Callout:248ee43449e4981b297adcdefcfe1a37770c8a87082119a07feaddfcd6f4f4ed
  // @lfy def/components/callout.lfy:Callout#Callout:Callout:661a5b3d6c48efed7635c264e756a0991b9df5a29386ba24da69002906cfdef0
  // @lfy def/components/callout.lfy:Callout#Callout:Callout:49cc088e4f0f92a04a99d23aba566419ed4adb6b0e010739edcb313f1a939537
  return (
    <aside className={className} role="note" aria-labelledby={headerId}>
      <img
        className={styles.icon}
        src={InfoImage}
        alt={iconAlt[kind]}
        width={18}
        height={18}
        decoding="async"
      />
      <div className={styles.message}>
        <div className={styles.header} id={headerId}>
          {header}
        </div>
        <div className={styles.content}>{content}</div>
      </div>
    </aside>
  );
}
